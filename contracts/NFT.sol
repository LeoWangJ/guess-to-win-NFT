//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    uint256 private MAX_SUPPLY = 10;

    constructor() ERC721("leowang", "LEO") {}

    function mint(string memory tokenURI) internal returns (uint256) {
        uint256 currentId = _tokenId.current();
        require(currentId < MAX_SUPPLY, "is mint upper limit");
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
