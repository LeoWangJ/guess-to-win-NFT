import React,{useEffect, useState} from 'react';
import { Table,Tag } from 'antd';
import { ethers } from 'ethers';
import { guessAddress } from '../web3/contract';
import Guess from '../abi/Guess.json'
import { USER } from '../contexts/user'
import web3modal from '../components/wallet/web3modal'

export default function MyGuessList() {
  const columns = [
    {
      title: 'guess number',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: 'has award',
      dataIndex: 'hasAward',
      key: 'hasAward',
      render: data => (
        <Tag color={data === 'false' ? 'volcano': 'geekblue'} key={data}>
          {data.toUpperCase()}
        </Tag>
      )
    }
  ]
  const [dataSource,setDataSource] = useState([])
  const { signer, setUser, setProvider,setSigner  } = USER()
  
  useEffect(()=>{
    getMyGuessList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  async function Wallet(){
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setUser(address)
  }

  async function getMyGuessList(){
    if(!signer) return Wallet()
    const GuessContract = new ethers.Contract(guessAddress,Guess.abi,signer)
    let list = await GuessContract.getMyGuess()
    list = list.map(i=>{
      return {
        key: i.itemId.toNumber(),
        itemId: i.itemId.toNumber(),
        hasAward:i.hasAward.toString()
      }
    })
    console.log(list)
    setDataSource(list);
  } 

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
