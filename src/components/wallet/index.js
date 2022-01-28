import web3modal from './web3modal'
async function Wallet() {
  const provider = await web3modal.connect()
  return provider
}
export default Wallet
