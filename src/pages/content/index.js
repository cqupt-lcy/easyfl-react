import React from 'react'
import FL from '../../components/FL'
import './index.css'
import { useRoutes } from 'react-router'
import routes from '../../router/router'
import { useState } from 'react'
import { createContext } from 'react'
export const MyContext = createContext()
export default function Content(props) {
  const routeelement = useRoutes(routes)
  const [testAcc,setTestAcc] = useState(JSON.parse(localStorage.getItem("testacc")) || [])
  const [trainning,setTrainning] = useState(JSON.parse(localStorage.getItem('trainning') || false))
  
  return (
    <MyContext.Provider value={{testAcc,setTestAcc,trainning,setTrainning}}>
    <div className={props.className}>
      {routeelement}
    </div>
    </MyContext.Provider>
  )
}
