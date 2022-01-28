import { Menu } from 'antd'
import {Link } from 'react-router-dom'
import web3modal from './wallet/web3modal'

import { TrophyOutlined, FolderOutlined, SettingOutlined,ProfileOutlined,WalletOutlined } from '@ant-design/icons'
const { SubMenu } = Menu
async function Wallet(){
  const provider = await web3modal
  return provider
}
export default function MenuTab(){
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
        Wallet 
      </Menu.Item>
    </Menu>
  );
}
