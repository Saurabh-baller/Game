import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav/BottomNav'
import AdminSideNav from './components/AdminSideBar'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TableErrorPage from './pages/TableErrorPage'

import ChooseTablePage from './pages/ChooseTablePage'
import TablePage from './pages/TablePage'
import DummyPage from './pages/DummyPage'
import MyAccountPage from './pages/MyAccountPage'

function App() {
  return (
    <div>
      <Router>
        <AdminSideNav />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/signup/:referrerID' element={<SignupPage />} />
          <Route path='/' element={<ChooseTablePage />} />
          <Route path='/live' element={<ChooseTablePage />} />
          <Route path='/:time/table/:number' element={<TablePage />} />
          <Route path='/table/:number/:error' element={<TableErrorPage />} />
          <Route path='/myAccount' element={<MyAccountPage />} />
          <Route path='/deposit' element={<DummyPage />} />
          <Route path='/rewards' element={<DummyPage />} />
          <Route path='/withdraw' element={<DummyPage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <BottomNav />
      </Router>
    </div>
  )
}

export default App
