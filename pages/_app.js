import '../styles/globals.css'
import MenuTab from '../components/menu'
import {Fragment} from 'react'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <MenuTab ></MenuTab>
      <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
