//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Guess is ReentrancyGuard {
    uint mintPrice = 0.08 ether;
    address payable owner;
    uint private MAX_MINT_AMOUNT = 50;
    // storage uint[] private awards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    struct AwardItem {
        uint itemId;
        uint nftAddress;
        address payable owner;
        uint tokenId;
    }
    
    struct GuessItem {
        uint itemId;
        bool isMinted;
        bool hasAward;
        address payable buyer;
    }
    
    mapping(uint => GuessItem) private idToGuessItem;

    constructor(){
        owner = payable(msg.sender);
        _setAllGuess();
    }
    
    // function randomAwardsNumber() private view returns(){
    //  
    // }
    
    function mintToken(address nftContract) private nonReentrant {

    }

    function getMiniPrice() public view returns (uint) {
        return mintPrice;
    }

    function _setAllGuess() private {
        
        for(uint i = 0; i < MAX_MINT_AMOUNT;i++){
            idToGuessItem[i+1] = GuessItem(
                i+1,
                false,
                false,
                payable(address(0)) 
            );
        }
    }
    
    function getAllGuess() public view returns(GuessItem[] memory){
        GuessItem[] memory items = new GuessItem[](MAX_MINT_AMOUNT);
        for(uint i = 0; i < MAX_MINT_AMOUNT; i++){
            uint currentId = idToGuessItem[i].itemId;
            GuessItem storage currentItem = idToGuessItem[currentId];
            items[i] = currentItem;
        }
        return items;
    }
    
    function guessToWin(uint itemId) public payable returns(bool){
        require(msg.value == mintPrice , "Price must to equal to mintPrice");
        require(0 < itemId && itemId < 50, "itemId is not valid");
        
        GuessItem storage currentItem = idToGuessItem[itemId];
        require(!currentItem[itemId].isMinted, "itemId was be choose!");
        
        currentItem[itemId].isMinted 
    }

}