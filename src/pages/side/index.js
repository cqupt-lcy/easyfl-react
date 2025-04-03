import React, { useState } from 'react'
import Menulist from '../../components/Menu/MenuList'
import './index.css'

export default function Side(props) {
  const [itemList,setItemList] = useState([{name:"任务1",id:"1"}])
  function handleAddItem(){
    setItemList([...itemList,{name:`任务${itemList.length+1}`,id:`${itemList.length+1}`}])  
  }
  return (
    <div className={props.className}>
      <Menulist itemList={itemList}/>
    </div>
  )
}
