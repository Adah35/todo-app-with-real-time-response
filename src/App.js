import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TodoList from './features/todo/TodoList'
import Layout from './components/Layout'

const App = () => {
  return (
    <Routes>
      <Route index element={<TodoList />} />
    </Routes>
  )
}

export default App