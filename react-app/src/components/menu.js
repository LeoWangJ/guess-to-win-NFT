import React from 'react';
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import web3modal from './wallet/web3modal'
import { ethers } from 'ethers'
import { USER } from '../contexts/user'
import { TrophyOutlined, FolderOutlined,ProfileOutlined,WalletOutlined } from '@ant-design/icons'


export default function MenuTab(){
  const { user, setUser, setProvider,setSigner } = USER()

  async function Wallet(){
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setUser(address)
  }
  

  return (
    <Menu mode="horizontal" style={{marginBottom:'10px'}}>
      <Menu.Item key="guessToWin" icon={<TrophyOutlined />}>
        <Link to="/">Guess to win NFT</Link>
      </Menu.Item>
      <Menu.Item key="allNFT" icon={<FolderOutlined />}>
        <Link to="/allNFT">ALL NFT</Link>
      </Menu.Item>
      <Menu.Item key="myNFT" icon={<ProfileOutlined />}>
        <Link to="/myNFT">My NFT</Link>
      </Menu.Item>
      <Menu.Item key="myGuessList" icon={<ProfileOutlined />}>
        <Link to="/myGuessList">My Guess List</Link>
      </Menu.Item>
      <Menu.Item key="alipay" icon={<WalletOutlined />} onClick={()=> Wallet()}>
        {user || `Wallet` } 
      </Menu.Item>
    </Menu>
  );
}
