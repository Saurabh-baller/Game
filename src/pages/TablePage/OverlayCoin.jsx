import React from 'react'

const OverlayCoin = ({ image }) => {
  return (
    <div
      className={`fixed z-50 flex items-center justify-center xl:h-96 w-52`}
    >
      <div className='z-10 rounded-md'>
        <img src={image} alt="" />
      </div>
    </div>
  )
}

export default OverlayCoin
