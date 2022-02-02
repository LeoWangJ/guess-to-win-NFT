import { ethers } from 'ethers';
import React,{useEffect,useState} from 'react';
import { nftAddress } from '../web3/contract';
import NFT from '../abi/NFT.json';
import { USER } from '../contexts/user'
import web3modal from '../components/wallet/web3modal'
import { Card } from 'antd';
import axios from 'axios'

const { Meta } = Card;

export default function MyNFT() {
  const { user,provider,signer, setUser, setProvider,setSigner  } = USER()
  const [NFTList, setNFTList] = useState([])

  useEffect(() => {
    getMyNFTList()
  }, []);

  async function Wallet(){
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setUser(address)
  }

  async function getMyNFTList(){
    if(!signer) return Wallet()
    const NFTContract = new ethers.Contract(nftAddress,NFT.abi,signer);
    let list = await NFTContract.getMyNFT()
    list = await Promise.all(list.map(async (i)=>{
      const itemId = i.itemId.toNumber()
      const tokenURI = await NFTContract.tokenURI(itemId)
      const meta = await axios.get(tokenURI)
      console.log(meta)
      return {
        itemId, 
        image: meta.data.image,
        description:meta.data.description,
        name: meta.data.name,
      }
    }))
    
    console.log(list)
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
              style={{ width: 240 ,margin:'10px'}}
              cover={<img alt="example" src={item.image} />}
            >
              <Meta title={item.name} description={item.description} />
            </Card>
          )
        })
      }
    </div>
  )
}
