import { ethers } from 'ethers';
import React,{useEffect,useState} from 'react';
import { nftAddress,nftJSON } from '../web3/contract';
import NFT from '../abi/NFT.json';
import { Card } from 'antd';
import axios from 'axios'

const { Meta } = Card;

export default function MyNFT() {
  const [NFTList, setNFTList] = useState([])

  useEffect(() => {
    getAllNFTList()
  }, []);

  async function getAllNFTList(){
    const provider = new ethers.providers.JsonRpcBatchProvider('https://rpc-mainnet.maticvigil.com')
    const NFTContract = new ethers.Contract(nftAddress,NFT.abi,provider);
    let soldList = await NFTContract.getAllSoldNFT()
    soldList = soldList.map(i=>i.itemId.toNumber());
    let list = [0,1,2,3,4,5,6,7,8,9]

    list = await Promise.all(list.map(async (i)=>{
      const itemId = i
      const tokenURI = `${nftJSON}/${itemId}.json`
      const meta = await axios.get(tokenURI)
      return {
        itemId, 
        image: meta.data.image,
        description:meta.data.description,
        name: meta.data.name,
        sold: soldList.includes(itemId)
      }
    }))
    setNFTList(list)

  }

  return (
    <div style={{display:'flex',flexWrap:'wrap'}}>
      {
        NFTList.map(item=>{
          return (
            <Card
              key={item.itemId}
              hoverable
              style={{ width: 240,margin:'10px' }}
              cover={<img alt="example" src={item.image} />}
            >
              <Meta title={`${item.name}${item.sold ? ` (sold)`: ``}`} description={item.description} />
            </Card>
          )
        })
      }
    </div>
  )
}
