import React from 'react'

const OverlayMessage = ({ message, messageStyle, type }) => {
  return (
    <div
      className={`fixed z-50 top-[45%] flex items-center justify-center left-[25%] xsm:left-[30%] sm:left-[38%] lg:left-[45%] md-[50%]   ${
        type === 'VERTICAL' ? 'top-[25%]' : ''
      } `}
    >
      <div className='z-10 px-6 py-4 bg-white rounded-md text-2xl shadow-lg'>
        <p className={`${messageStyle}`}>{message}</p>
      </div>
    </div>
  )
}

export default OverlayMessage
