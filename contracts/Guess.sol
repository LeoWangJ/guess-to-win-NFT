//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFT.sol";

contract Guess is ReentrancyGuard, NFT, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenSold;
    Counters.Counter private _nftSold;

    uint256 mintPrice = 0.08 ether;
    address payable owner;
    uint256 private MAX_MINT_AMOUNT = 50;
    uint256[] private awards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    string baseURI;

    struct AwardItem {
        uint256 itemId;
        address payable owner;
        bool sold;
    }

    struct GuessItem {
        uint256 itemId;
        bool hasAward;
        address payable buyer;
    }

    mapping(uint256 => GuessItem) private idToGuessItem;
    mapping(uint256 => AwardItem) private idToAwardItem;

    constructor(string memory _initBaseURI) {
        owner = payable(msg.sender);
        setBaseURI(_initBaseURI);
    }

    // function randomAwardsNumber() private view returns(){
    //
    // }
    function _baseURI(string memory uri)
        internal
        view
        virtual
        returns (string memory)
    {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function _mintToken(address nftContract, uint256 tokenId)
        private
        nonReentrant
    {
        uint newNftId = super.mint("");
        _nftSold.increment();
        idToAwardItem[newNftId] = AwardItem(newNftId,payable(msg.sender),true);
    }

    function getMiniPrice() public view returns (uint256) {
        return mintPrice;
    }

    function getAllGuess() public view returns (GuessItem[] memory) {
        uint256 currentSold = _tokenSold.current();
        GuessItem[] memory items = new GuessItem[](currentSold);
        for (uint256 i = 0; i < currentSold; i++) {
            GuessItem storage currentItem = idToGuessItem[i];
            items[i] = currentItem;
        }
        return items;
    }

    function guessToWin(address nftContract, uint256 itemId)
        public
        payable
        returns (bool)
    {
        require(msg.value == mintPrice, "Price must to equal to mintPrice");
        require(0 < itemId && itemId < 50, "itemId is not valid");

        bool isMinted = hasBeenMinted(itemId);
        require(!isMinted, "itemId was be choose!");

        _tokenSold.increment();
        uint256 newSoldId = _tokenSold.current();
        require(newSoldId <= 50, 'only 50 guess times');


        bool canGetAward = true;
        idToGuessItem[newSoldId] = GuessItem(itemId, canGetAward, payable(msg.sender));
        _mintToken(nftContract, itemId);
    }

    function hasBeenMinted(uint256 itemId) internal view returns (bool) {
        GuessItem[] memory items = getAllGuess();
        for (uint256 i = 0; i < items.length; i++) {
            uint256 currentId = items[i].itemId;
            if (currentId == itemId) return true;
        }
        return false;
    }

    function getAllSoldAwardNFT() public view returns (AwardItem[] memory){
        uint nftsold = _nftSold.current();
        AwardItem[] memory items = new AwardItem[](nftsold);
        for(uint i = 0; i < nftsold; i++){
            AwardItem storage currentItem = idToAwardItem[i];
            items[i] = currentItem;
        }
        return items;
    }
}
