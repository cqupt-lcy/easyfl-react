import React, { useContext } from 'react'
import ReactDOM from 'react-dom';
import { MyContext } from '../../../pages/content';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
export default function Charts() {
  const { testAcc, setTestAcc } = useContext(MyContext)
  return (
    <div>
      <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px",marginLeft:"20px" }}>训练结果</h3>
      <LineChart width={1000} height={400} data={testAcc}>
        <Line type="monotone" dataKey="Acc" stroke="#8884d8" />
        <Line type="monotone" dataKey="Loss" stroke="#82ca9d" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="Round" />
        <YAxis type="number" domain={[0,1]} allowDataOverflow />
        <Tooltip />
      </LineChart>
    </div>
  )
}
