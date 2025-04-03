import React, { useContext, useEffect, useState } from 'react'
import { Button, message, Space, Select, Empty } from 'antd';
import { ConnectedTrue, ConnectedFalse } from './components/Connected'
import { TrainningTrue, TrainningFalse } from './components/Trainning'
import { MyContext } from '../../App';
export default function Logs() {
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { trainning } = useContext(MyContext)
  const [isempty, setIsEmpty] = useState(true)
  const { testAcc, setTestAcc } = useContext(MyContext)
  let currentRound = 0
  useEffect(() => {
    const ws = new WebSocket('ws://10.16.53.208:8000/ws/logs')

    ws.onopen = () => {
      messageApi.open({
        type: 'success',
        content: '服务器连接成功!',
      })
      setConnected(true)
      console.log('服务器连接成功!');
    }
    ws.onerror = () => {
      messageApi.open({
        type: 'error',
        content: '错误!'
      })
      console.log('错误!');
    }
    ws.onmessage = (event) => {
      const logMessage = event.data;

      // 解析 Round 轮次
      const roundMatch = logMessage.match(/Round\s+(\d+)/);
      if (roundMatch) {
        currentRound = parseInt(roundMatch[1], 10); // 提取轮次并转为整数
      }

      // 解析 test_accuracy
      const accMatch = logMessage.match(/test_accuracy\s+([\d.]+)/);
      if (accMatch && currentRound !== null) {
        const testAccuracy = parseFloat(accMatch[1]); // 提取精度值

        // 存储 JSON 对象
        setTestAcc(prev => [...prev, { "round": currentRound, "Acc": testAccuracy }]);
      }
      setLogs(prevLogs => [...prevLogs, event.data])
      setIsEmpty(false)
    }


    return () => {
      ws.onclose = () => {
        messageApi.open({
          type: 'warning',
          content: '服务器连接已断开!'
        })
        setConnected(false)
        console.log('服务器连接已断开!');
      }
    }
  }, [])
  return (
    <div>
      {contextHolder}
      {connected ? <ConnectedTrue /> : <ConnectedFalse />}
      {trainning ? <TrainningTrue /> : <TrainningFalse />}
      {/* 训练日志 */}
      <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>训练日志</h3>
      {isempty ?
        <Empty />
        :
        <div style={{ height: "250px", overflowY: "auto", backgroundColor: "#343a40", color: "white", padding: "10px", borderRadius: "4px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>


      }

    </div>
  )
}
