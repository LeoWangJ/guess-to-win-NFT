import React,{useContext, useState} from 'react';

const Context = React.createContext()

export function USER(){
  return useContext(Context)
}

export function UserProvider({children}){
  const [user,setUser] = useState(undefined)
  const [provider,setProvider] = useState(undefined)
  const [signer,setSigner] = useState(undefined)

  const data = {
    user,
    provider,
    signer,
    setUser,
    setProvider,
    setSigner
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}
