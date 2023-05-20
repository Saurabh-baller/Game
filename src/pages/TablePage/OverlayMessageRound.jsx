import React from 'react'

const OverlayMessageRound = ({ message, messageStyle, type }) => {
  return (
    <div
      className={`fixed z-50 top-[45%] flex items-center justify-center left-[38%] xsm:left-[38%] sm:left-[38%] lg:left-[46%] top-[12%]
     `}
    >
      <div className='z-10 px-3 py-1 bg-white rounded-md text-md bg-gray-100 shadow-sm'>
        <p className={`${messageStyle}`}>{message}</p>
      </div>
    </div>
  )
}

export default OverlayMessageRound
