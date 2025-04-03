import React from 'react'
import { Button } from 'antd'
export default function Menulist(props) {
  return (
    <div>
          {
            props.itemList.map((item,index)=>{
              return <Button block key={index}>{item.name}</Button>
         })
          }
    </div>
  )
}
