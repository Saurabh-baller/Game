import omoLogo from '../../assets/img/omo-logo.png'
import { GoogleIcon } from '../../assets/icons'
import mobileGif from '../../assets/gif/mobile.gif'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import app from '../../config/firebase'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore'

import { useLoginInValidator } from './useLoginValidator.js'
import InputWithLabel from '../../components/InputFieldWithLabel'
import { useEffect } from 'react'

const auth = getAuth(app)
const fireStore = getFirestore(app)

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    login_hint: 'user@example.com',
  })
  signInWithPopup(auth, provider)
}

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState('')

  const [userAuth] = useAuthState(auth)

  const navigate = useNavigate()

  const {
    fields,
    trigger,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useLoginInValidator()

  function shortenId(longId) {
    const alphanumericOnly = longId.replace(/[^a-zA-Z0-9]/g, '')
    const shortId = alphanumericOnly.substring(0, 8)
    return shortId
  }

  function getServerTime() {
    return Math.floor(Date.now() / 1000)
  }

  const handleUserAuthenticated = () => {
    const userRef = doc(fireStore, 'users', userAuth.uid)
    setDoc(userRef, {
      email: userAuth.email,
      name: userAuth.displayName,
      tokenBalance: 0,
      bonusBalance: 10,
      shortID: shortenId(userAuth.uid),
      registeredAt: getServerTime(),
    })

    localStorage.setItem('userAuthID', userAuth.uid)
    navigate('/live')
  }

  useEffect(() => {
    if (userAuth) {
      if (userAuth.providerData[0].providerId === 'google.com') {
        getDoc(doc(fireStore, 'users', userAuth.uid))
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              localStorage.setItem('userAuthID', userAuth.uid)
              navigate('/live')
            } else {
              handleUserAuthenticated()
            }
            setLoading(false)
          })
          .catch((error) => {
            console.error('Error checking user:', error)
          })
      } else if (userAuth.email === 'omo6042game@gmail.com') {
        localStorage.setItem('adminAuthID', userAuth.uid)
        navigate('/admin/activeUsers')
        setLoading(false)
      } else {
        localStorage.setItem('userAuthID', userAuth.uid)
        navigate('/live')
        setLoading(false)
      }
    }
  }, [userAuth])

  const onSubmitLogIn = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // handle successful sign in
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          setAuthError('Wrong Password. Please try again.')
        } else if (error.code === 'auth/user-not-found') {
          setAuthError('User with this email address does not exist')
        } else
          setAuthError(
            error.message.substring(9).split(new RegExp('\\((.*)\\)'))[0]
          )
        setLoading(false)
      })
  }

  return (
    <div className='lg:w-full lg:h-[100vh] flex'>
      <div className='w-full px-8 md:w-[70%] md:mx-auto lg:w-[35%] lg:px-[50px]'>
        <div className='w-full flex justify-center py-[25px]'>
          <img src={omoLogo} className='h-[75px] w-[250px]' />
        </div>
        <form onSubmit={handleSubmit(onSubmitLogIn)} className='flex flex-col'>
          <div className='mb-[14px]'>
            <InputWithLabel
              name='email'
              labelText='Email'
              labelTextSize='14px'
              marginLabelField='4px'
              labelStyling='font-[500] text-gray-500'
              isRequired={true}
              placeholderText='someone@example.com'
              height='36px'
              width='100%'
              setValue={setValue}
              validation={{ ...fields.email }}
              errors={errors.email}
              trigger={trigger}
              onChangeTrigger={false}
              inputState={email}
              setInputState={setEmail}
            />
          </div>

          <div className='mb-[14px]'>
            <InputWithLabel
              name='password'
              labelText='Password'
              labelTextSize='14px'
              marginLabelField='4px'
              labelStyling='font-[500] text-gray-500'
              inputType='password'
              isRequired={true}
              placeholderText='Enter Password'
              height='36px'
              width='100%'
              setValue={setValue}
              validation={{ ...fields.password }}
              errors={errors.password}
              trigger={trigger}
              inputState={password}
              setInputState={setPassword}
            />
          </div>

          {authError && (
            <div className='text-[14px] text-[#D86161]'>{authError}</div>
          )}

          <button
            type='submit'
            className='w-full mt-[10px] text-white bg-[#000000] hover:bg-[#000000] focus:outline-none font-medium rounded-md px-5 py-2.5 mr-2 mb-2 dark:bg-[#000000] dark:hover:bg-gray-700 dark:focus:ring-[#000000] dark:border-[#000000]'
          >
            {loading ? 'Loading...' : 'Sign in'}
          </button>
        </form>

        <div className='flex my-[20px] md:my-[10px]'>
          <hr className='w-[45%] mt-[9px] h-[2px] mx-auto bg-gray-300 border-0 rounded lg:my-7' />
          <span className='text-gray-500 text-[13px] lg:my-5'>or</span>
          <hr className='w-[45%] mt-[9px] h-[2px] mx-auto  bg-gray-300 border-0 rounded lg:my-7' />
        </div>

        <button
          type='button'
          className='text-center text-gray-700 bg-white w-full hover:bg-gray-100 text-[17px] border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-md py-2.5 text-center inline-flex items-center'
          onClick={signInWithGoogle}
        >
          <div className='flex w-full justify-center'>
            <GoogleIcon className='w-[21px] mr-[10px]' />
            Sign in with Google
          </div>
        </button>

        <div className='w-full flex justify-center my-7 text-gray-700'>
          <span className='mr-[5px]'>Don't have an account?</span>
          <Link to='/signup'>
            <span className='text-[#00A1FF] font-bold hover:underline'>
              Sign up
            </span>
          </Link>
        </div>
      </div>
      <div className='hidden lg:block lg:w-[60%] bg-black'>
        <img src={mobileGif} className='h-[90vh] mx-auto mt-8 rounded-lg' />
      </div>
    </div>
  )
}

export default LoginPage
