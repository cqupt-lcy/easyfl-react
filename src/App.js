import React, { createContext, useState } from 'react'

import './App.css'
import Side from './pages/side'
import Content from './pages/content'

export function App() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <div className='appwrapper'>
      <Side className={`sidebar ${isCollapsed?"collapsed":"expanded"}`} />
      <span className='divider'></span>
      <Content className="content" />
    </div>
  )
}
