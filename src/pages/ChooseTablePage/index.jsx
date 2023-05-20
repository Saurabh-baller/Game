import React, { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import TablesCard from './TablesCard'
import { BitcoinIcon } from '../../assets/icons'
import Popup from '../../components/Popup'
import app from '../../config/firebase'
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'
import LoadingSpinner from '../../components/LoadingSpinner'
import NotAuthorised from '../../components/NotAuthorised'
import { Header } from '../../components/PageTitle'

const fireStore = getFirestore(app)

export const InputStar1Lock = atom(false)
export const InputStar2Lock = atom(true)
export const InputStar3Lock = atom(true)
export const InputTotalBalance = atom(0)
export const InputTokenBalance = atom(0)
export const InputFromLivePage = atom(false)
export const InputIsSpectator = atom(false)
export const InputTableAmount = atom(0)
export const InputTableLockChoice = atom(false)

const ChooseTablePage = () => {
  const userAuthID = localStorage.getItem('userAuthID')
  const [tokenBalance, setTokenBalance] = useAtom(InputTokenBalance)
  const [bonusBalance, setBonusBalance] = useState(0)
  const [totalBalance, setTotalBalance] = useAtom(InputTotalBalance)
  const [star1lock, setStar1lock] = useAtom(InputStar1Lock)
  const [star2lock, setStar2lock] = useAtom(InputStar2Lock)
  const [star3lock, setStar3lock] = useAtom(InputStar3Lock)
  const [loading, setLoading] = useState(true)

  const [level1time, setLevel1time] = useState(15)

  const fetchStarWiseTableStatus = async () => {
    const userRef = doc(fireStore, 'users', userAuthID)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      userSnap.data().star2TablesLock !== undefined
        ? setStar2lock(userSnap.data().star2TablesLock)
        : setStar2lock(true)

      userSnap.data().star3TablesLock !== undefined
        ? setStar3lock(userSnap.data().star3TablesLock)
        : setStar3lock(true)
    }

    setLoading(false)
  }
  useEffect(() => {
    fetchStarWiseTableStatus()
  }, [])

  useEffect(() => {
    const userRef = userAuthID ? doc(fireStore, 'users', userAuthID) : null

    let unsubscribe = null

    if (userRef) {
      unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setTokenBalance(parseFloat(doc.data().tokenBalance))
          setBonusBalance(parseFloat(doc.data().bonusBalance))
          setTotalBalance(
            parseFloat(doc.data().tokenBalance) +
              parseFloat(doc.data().bonusBalance)
          )
        } else {
          console.log('No such document!')
        }
        setLoading(false)
      })
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return userAuthID ? (
    loading ? (
      <LoadingSpinner />
    ) : (
      <div className='bg-gray-50 sm:flex sm:justify-center'>
        <div className=' p-4 flex flex-col overflow-scroll scrollbar-hide pb-[70px] sm:w-[500px]'>
          <Header title='CHOOSE TABLE' />
          <div className='flex justify-center mb-3'>
            <div className='flex w-fit border px-3 py-1 bg-white rounded-xl shadow-sm'>
              <div className='flex font-medium text-[16px] py-[1px] text-gray-600'>
                <span className='mr-2'>{totalBalance}</span>
                <BitcoinIcon className='my-1 w-[20px] h-[18px] text-yellow-500' />
              </div>
            </div>
          </div>

          <div className='hidden bg-[#058274] bg-[#033382] bg-[#9E1DAB] bg-[#7416D4] bg-[#08400F] bg-[#24432F] bg-[#3C3819] bg-[#854405] bg-[#240000] bg-[#002424] bg-[#0E192D] bg-[#011924] bg-[#200024] bg-[#292201] bg-[#000000] bg-[#DEDEDE] bg-[#037082] bg-[#796F40] bg-[#8D8D8D]'></div>

          <Popup />
          <TablesCard
            starNum={1}
            lockTime={3}
            time={level1time}
            minLimit={0.25}
          />
        </div>
      </div>
    )
  ) : (
    <NotAuthorised />
  )
}

export default ChooseTablePage
