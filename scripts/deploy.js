const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
async function main() {
  const Guess = await hre.ethers.getContractFactory("Guess");
  const guess = await Guess.deploy();

  await guess.deployed();
  const NFTJSON = 'https://infura-ipfs.io/ipfs/QmWphErXKTtjxAcSu66ARarmt5yd8z1tPSkGMZqHCmT7Pm/'
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(NFTJSON);

  await nft.deployed();


  console.log("Guess deployed to:", guess.address);
  console.log("NFT deployed to:", nft.address);

  let config = `
    export const guessAddress = '${guess.address}'
    export const nftAddress = '${nft.address}'
    export const nftJSON = '${NFTJSON}'
  `
  console.log(__dirname)
  fs.writeFileSync(path.resolve(__dirname,'../react-app/src/web3/contract.js'),config)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
