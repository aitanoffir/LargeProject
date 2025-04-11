import React from 'react'
import NavBar from '../Components/NavBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
        <NavBar />
        <div>
            <Outlet />
        </div>
    </>
  )
}

export default MainLayout
