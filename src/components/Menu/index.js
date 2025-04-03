import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router'

const items = [
  {
    key:'1',
    label:(<Link to="fl">联邦学习</Link>),
  },
  {
    key:'2',
    label:(<Link to="sam">SAM2</Link>)
  }
]
export default function MyMenu() {
  return (
    <Menu
    mode='inline'
    items={items}
    defaultSelectedKeys={['1']}
    />
  )
}
