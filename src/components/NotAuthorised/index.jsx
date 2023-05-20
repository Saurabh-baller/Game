import React from 'react'
import { Link } from 'react-router-dom'

const NotAuthorised = () => {
  return (
    <div className='flex flex-col justify-center h-[70vh] text-center items-center'>
      <img
        src='https://cdn-icons-png.flaticon.com/512/4123/4123751.png'
        className='w-[80px] mb-[20px]'
      ></img>
      <div className='font-bold text-[21px] mb-[20px]'>
        Please sign in first!
      </div>
      <div className='mb-[20px]'>
        This section is only allowed for authorised users.
      </div>
      <Link to='/login' className='text-blue-500 font-bold'>
        Login
      </Link>
    </div>
  )
}

export default NotAuthorised
