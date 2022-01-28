import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import web3modal from './wallet/web3modal'
import { ethers } from 'ethers'

import { TrophyOutlined, FolderOutlined, SettingOutlined,ProfileOutlined,WalletOutlined } from '@ant-design/icons'
import { useState } from 'react'
const { SubMenu } = Menu
export default function MenuTab(){
  const [address, setAddress] = useState("")

  async function Wallet(){
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    console.log(signer)

    setAddress(address)
    return provider
  }

  return (
    <Menu mode="horizontal">
      <Menu.Item key="mail" icon={<TrophyOutlined />}>
        <Link to="/">Guess to win NFT</Link>
      </Menu.Item>
      <Menu.Item key="app" disabled icon={<FolderOutlined />}>
        <Link to="/allNFT">ALL NFT</Link>
      </Menu.Item>
      <SubMenu key="SubMenu" icon={<SettingOutlined />} title="profile">
          <Menu.Item key="setting:1" icon={<ProfileOutlined />}> <Link to="/myNFT">My NFT</Link></Menu.Item>
          <Menu.Item key="setting:2" icon={<ProfileOutlined />}><Link to="/myGuessList">My Guess List</Link></Menu.Item>
      </SubMenu>
      <Menu.Item key="alipay" icon={<WalletOutlined />} onClick={()=> Wallet()}>
        {address || `Wallet` } 
      </Menu.Item>
    </Menu>
  );
}
