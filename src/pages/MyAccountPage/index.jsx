import React, { useState, useEffect } from 'react'
import { BitcoinIcon } from '../../assets/icons'
import { getAuth, signOut } from 'firebase/auth'
import app from '../../config/firebase'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  setDoc,
  getDoc,
  doc,
  collection,
  getFirestore,
  serverTimestamp,
  updateDoc,
  getDocs,
  query,
} from 'firebase/firestore'
import Papa from 'papaparse'
import LoadingSpinner from '../../components/LoadingSpinner'
import './index.css'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { Header } from '../../components/PageTitle'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import NotAuthorised from '../../components/NotAuthorised'
import { useAtom } from 'jotai'

const fireStore = getFirestore(app)
const auth = getAuth(app)

const MyAccountPage = () => {
  const [user, loading, error] = useAuthState(auth)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')

  const [loadingData, setLoadingData] = useState(false)

  const handleSignOut = () => {
    localStorage.clear()
    signOut(auth)
  }

  const fetchUserData = async () => {
    setLoadingData(true)
    const userRef = doc(fireStore, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setUsername(userSnap.data().username)
      userSnap.data().firstName &&
        userSnap.data().lastName &&
        setFullName(userSnap.data().firstName + ' ' + userSnap.data().lastName)
    }

    setLoadingData(false)
  }

  useEffect(() => {
    user && fetchUserData()
  }, [user])

  if (loading || loadingData) {
    return <LoadingSpinner />
  }

  // if (user) {
  return user ? (
    <>
      <div className=' flex flex-col sm:w-[630px] sm:mx-auto my-3'>
        <div className='flex justify-between mb-5'>
          <div className='mt-[15px] flex'>
            <div className='w-fit h-fit m-[2px] px-[8px] border border-gray-300 bg-white rounded-md py-1 text-sm'>
              User ID:{' '}
              <span className='text-sky-700 font-bold'>{user?.uid}</span>
            </div>
          </div>
          <img
            src={
              user?.photoURL
                ? user.photoURL
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
            }
            className='w-[50px] h-[50px] rounded-full'
          />
        </div>

        <div className='Profile mb-[30px]'>
          <div className='flex flex-col'>
            <div className='font-bold bg-gray-500 w-fit px-[10px] py-[5px] text-white rounded-md text-[14px] mb-[7px]'>
              PROFILE
            </div>
            {username !== undefined ? (
              <div className='flex justify-between'>
                <span className='font-semibold'>Username</span>
                <span>{username}</span>
              </div>
            ) : null}
            <div className='flex justify-between'>
              <span className='font-semibold'>Email</span>
              <span className='flex'>
                {user?.email}
                <CheckBadgeIcon
                  width='18px'
                  height='18px'
                  className='mt-[5px] ml-[3px] text-green-500'
                />
              </span>
            </div>

            {fullName !== '' && (
              <div className='flex justify-between'>
                <span className='font-semibold'>Name</span>
                <span className='flex'>{fullName}</span>
              </div>
            )}
          </div>
        </div>

        <div className='pb-[60px]'>
          <div
            className='cursor-pointer font-bold bg-blue-400 w-fit px-[10px] py-[7px] text-white rounded-md text-[14px] flex'
            onClick={() => handleSignOut()}
          >
            <ArrowLeftOnRectangleIcon className='w-5 h-5 mr-2' />
            Log out
          </div>
        </div>
      </div>
    </>
  ) : (
    <NotAuthorised />
  )
}

export default MyAccountPage
