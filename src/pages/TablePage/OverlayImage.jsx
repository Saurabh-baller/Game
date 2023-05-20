import React from 'react'

const OverlayImage = ({ image }) => {
  return (
    <div
      className={`fixed z-50 flex items-center justify-center xl:mr-96 `}
    >
      <div className='z-10 rounded-md'>
        <img src={image} alt="" />
      </div>
    </div>
  )
}

export default OverlayImage
