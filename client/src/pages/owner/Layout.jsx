import React, { useEffect } from 'react' // Added useEffect import
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate} = useAppContext()

  useEffect(() => {
    if (!isOwner) { 
      navigate('/')
    }
  }, [isOwner])
  
  return (
    <div className='min-h-screen flex flex-col'>
      <NavbarOwner />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout