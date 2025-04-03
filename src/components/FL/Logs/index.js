import React, { useContext, useEffect, useState, useRef } from 'react'
import { Button, message, Space, Select, Empty } from 'antd';
import { ConnectedTrue, ConnectedFalse } from './components/Connected'
import { TrainningTrue, TrainningFalse } from './components/Trainning'
import { MyContext } from '../../../pages/content';
import './index.css'
export default function Logs() {
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { trainning, setTrainning } = useContext(MyContext)
  const [isempty, setIsEmpty] = useState(true)
  const { testAcc, setTestAcc} = useContext(MyContext)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const logContainerRef = useRef(null)
  let currentRound = 0
  let pendingMetrics = {};
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
      const roundMatch = logMessage.match(/Round\s+(\d+)/);
      const accMatch = logMessage.match(/test_accuracy\s+([\d.]+)/);
      const lossMatch = logMessage.match(/test_loss\s+([\d.]+)/);

      if (roundMatch) {
        currentRound = parseInt(roundMatch[1], 10);
        pendingMetrics[currentRound] = pendingMetrics[currentRound] || {};
        pendingMetrics[currentRound].Round = currentRound;
      }

      // 处理 test_accuracy
      if (accMatch && currentRound !== null) {
        pendingMetrics[currentRound] = pendingMetrics[currentRound] || {};
        pendingMetrics[currentRound].Acc = parseFloat(accMatch[1]);
      }

      // 处理 test_loss
      if (lossMatch && currentRound !== null) {
        pendingMetrics[currentRound] = pendingMetrics[currentRound] || {};
        pendingMetrics[currentRound].Loss = parseFloat(lossMatch[1]);
      }

      // **检查是否收集到了完整的 round、Acc 和 Loss，若完整则存入状态**
      if (
        pendingMetrics[currentRound] &&
        pendingMetrics[currentRound].Round !== undefined &&
        pendingMetrics[currentRound].Acc !== undefined &&
        pendingMetrics[currentRound].Loss !== undefined
      ) {
        setTestAcc(prev => [...prev, pendingMetrics[currentRound]]);
        delete pendingMetrics[currentRound]; // 清除已存储的轮次数据
      }

      // 存储 JSON 对象

      setLogs(prevLogs => [...prevLogs, logMessage])
      setIsEmpty(false)
    }
    ws.onclose = () => {
      messageApi.open({
        type: 'warning',
        content: '服务器连接已断开!'
      })
      setConnected(false)
      console.log('服务器连接已断开!');
    }

    
  }, [])

  useEffect(() => {
    const logContainer = logContainerRef.current;
    if (!logContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = logContainer;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5); // 允许有 10px 误差
    };

    logContainer.addEventListener('scroll', handleScroll);
    return () => logContainer.removeEventListener('scroll', handleScroll);
  }, [])

  useEffect(() => {
    if (isAtBottom && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]); // 监听 logs 变化



  useEffect(() => {
    localStorage.setItem("testacc",JSON.stringify(testAcc))
  },[testAcc])


  return (
    <div className='logswrapper'>
      {contextHolder}
      <div className='statuswrapper'>
      {connected ? <ConnectedTrue /> : <ConnectedFalse />}
      {trainning ? <TrainningTrue /> : <TrainningFalse />}
      </div>
      {/* 训练日志 */}
      <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>训练日志</h3>
      {isempty ?
        <Empty />
        :
        <div
          ref={logContainerRef}
          className="logContent">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      }

    </div>
  )
}
