// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _nftSold;

    // Constants
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public maxMint = 1;

    string baseURI;
    string public baseExtension = ".json";

    struct AwardItem {
        uint256 itemId;
        address payable ownerAddress;
        bool sold;
    }

    mapping(uint256 => string) private _tokenURIs;

    mapping(uint256 => AwardItem) private idToAwardItem;

    constructor(string memory initBaseURI) ERC721("Leo Meta", "Leo") {
        setBaseURI(initBaseURI);
    }

    function mint(uint256 tokenQuantity) public payable {
        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );
        require(tokenQuantity <= maxMint, "Can only mint 1 tokens at a time");

        _mint(tokenQuantity);
    }

    function _mint(uint256 tokenQuantity) internal {
        for (uint256 i = 0; i < tokenQuantity; i++) {
            uint256 mintIndex = totalSupply();
            if (totalSupply() < MAX_SUPPLY) {
                _safeMint(msg.sender, mintIndex);
                uint256 newNFTId = _nftSold.current();
                console.log("newNFTId:", newNFTId);
                idToAwardItem[newNFTId + 1] = AwardItem(
                    newNFTId,
                    payable(msg.sender),
                    true
                );
                _nftSold.increment();
            }
        }
    }

    function getAllSoldNFT() public view returns (AwardItem[] memory) {
        uint256 currentSold = _nftSold.current();

        AwardItem[] memory items = new AwardItem[](currentSold);
        for (uint256 i = 0; i < currentSold; i++) {
            AwardItem storage currentItem = idToAwardItem[i + 1];
            items[i] = currentItem;
        }

        return items;
    }

    function getMyNFT() public view returns (AwardItem[] memory) {
        uint256 currentSold = _nftSold.current();
        uint256 myNFTAmount = 0;
        for (uint256 i = 0; i < currentSold; i++) {
            if (msg.sender == idToAwardItem[i + 1].ownerAddress) {
                myNFTAmount++;
            }
        }

        AwardItem[] memory items = new AwardItem[](myNFTAmount);

        for (uint256 i = 0; i < currentSold; i++) {
            console.log(msg.sender, idToAwardItem[i + 1].ownerAddress);

            if (msg.sender == idToAwardItem[i + 1].ownerAddress) {
                AwardItem storage currentItem = idToAwardItem[i + 1];
                items[i] = currentItem;
            }
        }
        return items;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return
            string(abi.encodePacked(base, tokenId.toString(), baseExtension));
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }

    function getAllSoldAwardNFT() public view returns (AwardItem[] memory) {
        uint256 nftsold = _nftSold.current();
        AwardItem[] memory items = new AwardItem[](nftsold);
        for (uint256 i = 0; i < nftsold; i++) {
            AwardItem storage currentItem = idToAwardItem[i];
            items[i] = currentItem;
        }
        return items;
    }
}
