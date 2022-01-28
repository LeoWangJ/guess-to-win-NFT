import { Menu } from 'antd'
import Link from 'next/link'

import { TrophyOutlined, FolderOutlined, SettingOutlined,ProfileOutlined,WalletOutlined } from '@ant-design/icons'
const { SubMenu } = Menu

export default function MenuTab(){
  return (
    <Menu mode="horizontal">
      <Menu.Item key="mail" icon={<TrophyOutlined />}>
        <Link href="/">Guess to win NFT</Link>
      </Menu.Item>
      <Menu.Item key="app" disabled icon={<FolderOutlined />}>
        <Link href="/allNFT">ALL NFT</Link>
      </Menu.Item>
      <SubMenu key="SubMenu" icon={<SettingOutlined />} title="profile">
          <Menu.Item key="setting:1" icon={<ProfileOutlined />}> <Link href="/myNFT">My NFT</Link></Menu.Item>
          <Menu.Item key="setting:2" icon={<ProfileOutlined />}><Link href="/myGuessList">My Guess List</Link></Menu.Item>
      </SubMenu>
      <Menu.Item key="alipay" icon={<WalletOutlined />}>
        Wallet 
      </Menu.Item>
    </Menu>
  );
}
