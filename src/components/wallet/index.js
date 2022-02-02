
import web3modal from './web3modal'
import { ethers } from 'ethers'
import { USER} from '../../contexts/user'

export default async function Wallet(){
  const {setUser, setProvider,setSigner } = USER()

  const connection = await web3modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  setProvider(provider)
  setSigner(signer)
  setUser(address)
}