import React,{ useEffect,useState } from 'react';
import { USER } from '../contexts/user'
import { guessAddress,nftAddress } from '../web3/contract'
import Guess from '../abi/Guess.json'
import NFT from '../abi/NFT.json'
import web3modal from '../components/wallet/web3modal'
import {ethers} from 'ethers'
import { Modal,Spin,notification } from 'antd';
import axios from 'axios';
import '../css/index.css'
const ALL_GUESS = 50

export default function GuessToWin() {
  const { signer, setUser, setProvider,setSigner  } = USER()
  const [guessList, setGuessList] = useState([])
  const [list, setList] = useState([])
  const [loading,setLoading] = useState(false)
  async function Wallet(){
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setUser(address)
  }

  useEffect(() => {
    getAllGuessNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAllGuessNumber(){
      const customProvider = new ethers.providers.JsonRpcBatchProvider('https://rpc-mainnet.maticvigil.com')
      const GuessContract = new ethers.Contract(guessAddress,Guess.abi,customProvider)
      
      let list = await GuessContract.getAllGuess()
      console.log(list)
      list = list.map(item => {
        console.log(+item.itemId.toString())
        return +item.itemId.toString()
      }) 
      setGuessList(list)
      getList(list)
  }

  function getList(list){
    let arr = []
    for(let i =1; i <= ALL_GUESS;i++){
      let guessed = false
      if(list.includes(i)) guessed = true
      arr.push({id:i,guessed})
    }
    setList(arr)
  } 
  
  async function selectGuess(id){
    if(guessList.includes(id)) return
    if(!signer) return Wallet()
    const GuessContract = new ethers.Contract(guessAddress,Guess.abi,signer)
    let price = await GuessContract.getMiniPrice() 
    price = price.toString()
    setLoading(true)
    let trasaction = await GuessContract.guessToWin(id.toString(),{value:price})
    let tx = await trasaction.wait() 
    let event = tx.events[1]
    console.log(event)
    let isGetAward = event.args.hasAward
    if(isGetAward) {
      notification.info({
        message: 'Congratulation!',
        description:'You win the NFT! you need to mint it by this transaction',
        placement:'topLeft'
      });
      const NFTContract = new ethers.Contract(nftAddress,NFT.abi,signer)
      let transaction = await NFTContract.mint(1)
      let tx = await transaction.wait()
      let event = tx.events[0]
      let tokenId = event.args.tokenId
      let tokenURI = await NFTContract.tokenURI(tokenId)
      let meta = await axios.get(tokenURI)
      showWinNFTModal(meta.data)
    }

    getAllGuessNumber()
    setLoading(false)
  }

  function showWinNFTModal(data){
    Modal.success({
      title: `Congratulation get winner NFT - ${data.name}`,
      content: <img alt="pic" src={data.image} style={{width:`240px`}}/>
    });
  }

  return (
    <Spin tip="handle guess number transaction..." spinning={loading}>
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {
          list.map((item)=>{
            return (
                <div 
                  key={item.id} 
                  className={'item ' + (item.guessed ? 'guessed':'')}
                  onClick={()=> selectGuess(item.id) }
                >{item.id}</div>)
          })
        }
      </div>
    </Spin>
  )
}
