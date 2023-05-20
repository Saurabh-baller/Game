import {
  ArchiveBoxArrowDownIcon,
  TrophyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import React from 'react'
import { Link } from 'react-router-dom'

import { LiveIcon, BitcoinIcon } from '../../assets/icons'

const BottomNavItem = ({ title, path, index }) => {
  return (
    <Link to={path}>
      <div className='flex justify-center'>
        {title == 'Go Live' ? (
          <LiveIcon
            id='nav-item-3'
            className='w-[60px] h-[28px] text-gray-500'
          />
        ) : title === 'Rewards' ? (
          <TrophyIcon
            id='nav-item-4'
            className='w-[60px] h-[28px] text-gray-500 '
          />
        ) : title === 'Deposit' ? (
          <BitcoinIcon
            id='nav-item-2'
            className='w-[60px] pb-[1px] h-[28px] text-gray-500'
          />
        ) : title === 'Withdraw' ? (
          <ArchiveBoxArrowDownIcon
            id='nav-item-5'
            className='w-[60px] h-[29px] text-gray-500'
          />
        ) : (
          title === 'Account' && (
            <UserCircleIcon
              id='nav-item-1'
              className='w-[60px] h-[29px] text-gray-500'
            />
          )
        )}
      </div>
      <div
        className='text-[9px] mt-[2px] md:text-[14px] text-gray-500 font-semibold'
        id={`nav-item-text-${index}`}
      >
        {title}
      </div>
    </Link>
  )
}

export default BottomNavItem
