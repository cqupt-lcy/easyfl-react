import React, { useContext } from 'react'
import {SyncOutlined} from '@ant-design/icons';
import { MyContext } from '../../../../../App';
export function TrainningTrue() {
  return (
    <div>
      <SyncOutlined spin={true} />
      <span>炼丹中...</span>
    </div>
  )
}

export function TrainningFalse() {
  return (
    <div>
      <SyncOutlined spin={false} />
      <span>休息中...</span>
    </div>
  )
}