//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Guess is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenSold;

    uint256 mintPrice = 0.08 ether;
    address payable ownerAddress;
    uint256 private MAX_MINT_AMOUNT = 50;
    // faker random
    uint256[] private awardData = [1, 3, 17, 25, 29, 35, 47, 36, 13, 50];

    struct GuessItem {
        uint256 itemId;
        bool hasAward;
        address payable buyer;
    }

    event GuessToMinted(uint256 indexed itemId, bool indexed hasAward);

    mapping(uint256 => GuessItem) private idToGuessItem;

    constructor() {
        ownerAddress = payable(msg.sender);
    }

    function getMiniPrice() public view returns (uint256) {
        return mintPrice;
    }

    function getAllGuess() public view returns (GuessItem[] memory) {
        uint256 currentSold = _tokenSold.current();
        GuessItem[] memory items = new GuessItem[](currentSold);
        for (uint256 i = 0; i < currentSold; i++) {
            uint256 currentId = i + 1;
            GuessItem storage currentItem = idToGuessItem[currentId];
            items[i] = currentItem;
        }
        return items;
    }

    function getMyGuess() public view returns (GuessItem[] memory) {
        uint256 currentSold = _tokenSold.current();
        uint256 countIndex = 0;
        for (uint256 i = 0; i < currentSold; i++) {
            uint256 currentId = i + 1;
            if (msg.sender == idToGuessItem[currentId].buyer) {
                countIndex++;
            }
        }

        GuessItem[] memory items = new GuessItem[](countIndex);
        uint256 index = 0;
        for (uint256 i = 0; i < currentSold; i++) {
            uint256 currentId = i + 1;
            GuessItem storage currentItem = idToGuessItem[currentId];
            if (msg.sender == idToGuessItem[currentId].buyer) {
                items[index] = currentItem;
                index++;
            }
        }
        return items;
    }

    function guessToWin(uint256 itemId) public payable returns (bool) {
        require(msg.value == mintPrice, "Price must to equal to mintPrice");
        require(0 < itemId && itemId < 50, "itemId is not valid");

        bool isMinted = hasBeenMinted(itemId);
        require(!isMinted, "itemId was be choose!");

        _tokenSold.increment();
        uint256 newSoldId = _tokenSold.current();
        require(newSoldId <= 50, "only 50 guess times");
        console.log(itemId);
        bool canGetAward = isGetAward(itemId);
        idToGuessItem[newSoldId] = GuessItem(
            itemId,
            canGetAward,
            payable(msg.sender)
        );
        emit GuessToMinted(itemId, canGetAward);
        return canGetAward;
    }

    function hasBeenMinted(uint256 itemId) internal view returns (bool) {
        GuessItem[] memory items = getAllGuess();
        for (uint256 i = 0; i < items.length; i++) {
            uint256 currentId = items[i].itemId;
            console.log("hasBeenMinted:", currentId, itemId);
            if (currentId == itemId) return true;
        }
        return false;
    }

    function isGetAward(uint256 itemId) internal view returns (bool) {
        for (uint256 i = 0; i < awardData.length; i++) {
            uint256 awardId = awardData[i];
            if (awardId == itemId) return true;
        }
        return false;
    }
}
