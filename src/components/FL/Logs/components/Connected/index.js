import React from 'react'
import { Button, message, Space } from 'antd';
import { SmileTwoTone, MehTwoTone,SyncOutlined  } from '@ant-design/icons'

export function ConnectedTrue() {
  return (
    <div>
      <SmileTwoTone />
      <span>服务器已连接</span>
    </div>
  )
}
export function ConnectedFalse({func}) {
  return (
    <div>
      <MehTwoTone />
    <span>服务器连接断开</span>

    <Button type="primary" onClick={func}>重新连接服务器</Button>
    </div>
  )
}
