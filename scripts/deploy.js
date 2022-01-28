const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Guess = await hre.ethers.getContractFactory("Guess");
  const guess = await Guess.deploy();

  await guess.deployed();

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  await nft.deployed();


  console.log("Guess deployed to:", guess.address);
  console.log("NFT deployed to:", nft.address);

  let config = `
    export const guessAddress = '${guess.address}'
    export const nftAddress = '${nft.address}'
  `
  fs.writeFileSync('../src/web3/contract.js',config)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
