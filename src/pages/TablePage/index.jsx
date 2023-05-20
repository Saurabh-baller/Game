import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { Link, useNavigate, useParams } from 'react-router-dom'
import app from '../../config/firebase'
import rightRoadPressedGif from '../../assets/icons/road/R_Press.gif'
import leftRoadTimerGif from '../../assets/icons/road/L.Timer.gif'
import rightRoadTimerGif from '../../assets/icons/road/R.Timer.gif'
import leftRoadPressedGif from '../../assets/icons/road/L_Press_01.gif'
import leftRoadWonGif from '../../assets/icons/road/L_Win_Green.gif'
import leftRoadLoseGif from '../../assets/icons/road/L_Lose_Red.gif'
import rightRoadWonGif from '../../assets/icons/road/R_Win_Green.gif'
import rightRoadLoseGif from '../../assets/icons/road/R_Lose_Red.gif'
import leftCoin from '../../assets/icons/road/Coin_Left.gif'
import rightCoin from '../../assets/icons/road/Coin_Right.gif'
import youWin from '../../assets/icons/road/YouWin.gif'
import youLose from '../../assets/icons/road/YouLose.gif'
import flatEarthGif from '../../assets/icons/earth/FlatEarth.gif'
import flatEarthPressedGif from '../../assets/icons/earth/FlatEarthPressed.gif'
import earthGif from '../../assets/icons/earth/Earth.gif'
import earthPressedGif from '../../assets/icons/earth/EarthPressed.gif'
import leftTrianglePressed from '../../assets/icons/triangle/leftPressed.gif'
import leftTriangleLocked from '../../assets/icons/triangle/leftLocked.gif'
import rightTrianglePressed from '../../assets/icons/triangle/rightPressed.gif'
import rightTriangleLocked from '../../assets/icons/triangle/rightLocked.gif'
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  onDisconnect,
  get,
  runTransaction,
} from 'firebase/database'
import { useList } from 'react-firebase-hooks/database'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getFirestore,
  onSnapshot,
  increment,
} from 'firebase/firestore'
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import {
  CircleStackIcon,
  ShareIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid'
import {
  BitcoinIcon,
  Button1Turq,
  Button2Turq,
  Button1TurqPressedNormal,
  Button1TurqPressedGreen,
  Button1TurqPressedRed,
  Button2TurqPressedNormal,
  Button2TurqPressedGreen,
  Button2TurqPressedRed,
  Button1Gray,
  Button2Gray,
  Button1GrayPressedNormal,
  Button1GrayPressedGreen,
  Button1GrayPressedRed,
  Button2GrayPressedNormal,
  Button2GrayPressedGreen,
  Button2GrayPressedRed,
  LeftPink,
  LeftPinkPressed,
  RightPink,
  RightPinkPressed,
  LeftYellow,
  LeftYellowPressed,
  RightYellow,
  RightYellowPressed,
  GreenLeft,
  GreenRight,
  RedLeft,
  RedRight,
  Road,
  Earth,
  Flat_Earth,
  LeftTriangle,
  RightTriangle,
} from '../../assets/icons'
import NotAuthorised from '../../components/NotAuthorised'
import LoadingSpinner from '../../components/LoadingSpinner'
import ProgressRing from './ProgressRing'
import {
  InputFromLivePage,
  InputIsSpectator,
  InputTableAmount,
  InputTableLockChoice,
} from '../ChooseTablePage'
import Popup, {
  InputIsModalOpen,
  InputModalContent,
  InputModalHeader,
  InputModalType,
} from '../../components/Popup'
import { generateRandomTable } from '../../utils/TableDesign/TableSelect.js'
import OverlayMessage from './OverlayMessage'
import leftBlueBorder from '../../assets/icons/border/blue_border/left.png'
import topBlueBorder from '../../assets/icons/border/blue_border/top.png'
import rightBlueBorder from '../../assets/icons/border/blue_border/right.png'
import bottomBlueBorder from '../../assets/icons/border/blue_border/bottom.png'
import leftGoldBorder from '../../assets/icons/border/gold_border/left.png'
import topGoldBorder from '../../assets/icons/border/gold_border/top.png'
import rightGoldBorder from '../../assets/icons/border/gold_border/right.png'
import bottomGoldBorder from '../../assets/icons/border/gold_border/bottom.png'
import OverlayMessageRound from './OverlayMessageRound'
import OverlayImage from './OverlayImage'
import OverlayCoin from './OverlayCoin'
import RightImageSwapper from './RightImageSwapper'
import LeftImageSwapper from './LeftImageSwapper'

const database = getDatabase(app)
const fireStore = getFirestore(app)

const TablePage = () => {
  const currentTable = useParams().number
  const tableTime = parseInt(useParams().time)
  const navigate = useNavigate()

  const userAuthID = localStorage.getItem('userAuthID')
  const [liveUserSnapshots, loadingLiveUsers, error] = useList(
    ref(database, `users/table${currentTable}/players`)
  )
  var liveUsers = liveUserSnapshots
    ? liveUserSnapshots?.filter(
        (snapshots, index, self) =>
          index === self.findIndex((t) => t.key === snapshots.key)
      )
    : []

  const [time, setTime] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [tableAmount, setTableAmount] = useAtom(InputTableAmount)
  const [finalResultCalled, setFinalResultCalled] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [bonusBalance, setBonusBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [playerBox, setPlayerBox] = useState(0)
  const [result, setResult] = useState('')
  const [box1Ratio, setBox1Ratio] = useState(0)
  const [box2Ratio, setBox2Ratio] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isSpectator, setIsSpectator] = useAtom(InputIsSpectator)
  const [lockChoice, setLockChoice] = useAtom(InputTableLockChoice)
  const [fromLivePage, setFromLivePage] = useAtom(InputFromLivePage)

  const [winCount, setWinCount] = useState(0)
  const [loseCount, setLoseCount] = useState(0)

  const [open, setModalOpen] = useAtom(InputIsModalOpen)
  const [modalHeader, setModalHeader] = useAtom(InputModalHeader)
  const [modalContent, setModalContent] = useAtom(InputModalContent)
  const [modalType, setModalType] = useAtom(InputModalType)

  const [tableType, setTableType] = useState('VERTICAL')
  const [tableBgColor, setTableBgColor] = useState('#0E192D')
  const [tableButtonsType, setTableButtonsType] = useState('GRAY_12')
  const [tableResultType, setTableResultType] = useState('BACKGROUND_COLORED')
  const [btn1Clicked, setBtn1Clicked] = useState(false)
  const [btn2Clicked, setBtn2Clicked] = useState(false)

  const [isBonusRound, setIsBonusRound] = useState(false)
  const [isFreeRound, setIsFreeRound] = useState(false)
  var timer = 0
  // Final Result Calc
  const finalResult = async () => {
    var liveUsers = liveUserSnapshots.filter(
      (snapshots, index, self) =>
        index === self.findIndex((t) => t.key === snapshots.key)
    )
    const userRef = doc(fireStore, 'users', userAuthID)
    var box1Count = 0,
      box2Count = 0
    liveUsers.map((snapshot) => {
      if (snapshot.val().boxClicked === 1) ++box1Count
      if (snapshot.val().boxClicked === 2) ++box2Count
    })
    var totalPlayer = box1Count + box2Count === 0 ? 1 : box1Count + box2Count

    // Winning box of current game
    var win = box1Count < box2Count ? 1 : box1Count > box2Count ? 2 : 0

    const box1Res = ((box1Count / totalPlayer) * 100).toFixed(0)
    const box2Res = ((box2Count / totalPlayer) * 100).toFixed(0)
    setBox1Ratio(box1Res)
    setBox2Ratio(box2Res)

    await updateDoc(userRef, {
      [`allGamesPlayed.secondsPlayed`]: increment(tableTime),
    })

    // Current player result and updating token balance accordingly
    if (!isSpectator) {
      if (win === 0) {
        setResult('draw')
        await updateDoc(userRef, {
          [`allGamesPlayed.draws`]: increment(1),
        })
        console.log('match drawn')
        setLoseCount(0)
        setWinCount(0)
        setTimeout(() => updateTableDesign(), 3000)
      } else if (playerBox === win) {
        setResult('win')
        const updatedBalance = tokenBalance + tableAmount
        setTokenBalance(updatedBalance)
        isBonusRound
          ? await updateDoc(userRef, { bonusBalance: updatedBalance })
          : await updateDoc(userRef, { tokenBalance: updatedBalance })
        await updateDoc(userRef, {
          [`allGamesPlayed.wins`]: increment(1),
        })
        setLoseCount(0)
        setWinCount(winCount + 1)
        if (winCount + 1 === 10) {
          updateDoc(userRef, {
            [`reward2status.table`]: currentTable,
            [`reward2status.result`]: 'win',
            [`reward2status.current`]: 'unclaimed',
          })
        }
      } else if (playerBox !== win) {
        setResult('lose')
        const updatedBalance = isFreeRound
          ? tokenBalance
          : tokenBalance - tableAmount

        if (updatedBalance >= 0) {
          setTokenBalance(updatedBalance)
          updateDoc(userRef, {
            tokenBalance: updatedBalance,
          })
          console.log('heree')
        } else {
          setBonusBalance(tableAmount - tokenBalance)
          setTokenBalance(0)
          updateDoc(userRef, {
            bonusBalance: bonusBalance - (tableAmount - tokenBalance),
            tokenBalance: 0,
          })
          console.log('heree2')
        }

        // isBonusRound
        //   ? await updateDoc(userRef, { bonusBalance: updatedBalance })
        //   : await updateDoc(userRef, { tokenBalance: updatedBalance })

        await updateDoc(userRef, {
          [`allGamesPlayed.loses`]: increment(1),
        })
        setLoseCount(loseCount + 1)
        setWinCount(0)
        if (loseCount + 1 === 10) {
          updateDoc(userRef, {
            [`reward2status.table`]: currentTable,
            [`reward2status.result`]: 'lose',
            [`reward2status.current`]: 'unclaimed',
          })
        } else if (loseCount + 1 === 3) {
          setTimeout(() => setIsBonusRound(true), 3000)
        } else if (loseCount + 1 === 8) {
          setTimeout(() => setIsFreeRound(true), 3000)
        }
      }
    }

    if (!isSpectator) {
      await updateDoc(userRef, {
        [`tablesPlayedCount.table${currentTable}Count`]: increment(1),
      })

      await updateDoc(userRef, {
        [`allGamesPlayed.total`]: increment(1),
      })

      // updating the table played count
      const path = `users/table${currentTable}/playCount`
      runTransaction(ref(database, path), (currentValue) => {
        if (currentValue === null) {
          // If the value does not exist, initialize it to 1
          return 1
        } else {
          // Otherwise, increment the value
          return currentValue + 1
        }
      })
    }
  }

  // Box Clicks
  const handleBox1Click = () => {
    const player = document.getElementById('player')
    player.setAttribute('style', 'top: -150px')

    set(
      ref(
        database,
        'users/' + `table${currentTable}/` + 'players/' + userAuthID
      ),
      {
        boxClicked: 1,
      }
    )

    setPlayerBox(1)
  }
  const handleBox2Click = () => {
    const player = document.getElementById('player')
    player.setAttribute('style', 'top: 48px')

    set(
      ref(
        database,
        'users/' + `table${currentTable}/` + 'players/' + userAuthID
      ),
      {
        boxClicked: 2,
      }
    )

    setPlayerBox(2)
  }
  const handleButton1Click = (e) => {
    // e.stopPropagation()
    setBtn1Clicked(true)
    setBtn2Clicked(false)
    set(
      ref(
        database,
        'users/' + `table${currentTable}/` + 'players/' + userAuthID
      ),
      {
        boxClicked: 1,
      }
    )
    setPlayerBox(1)
  }
  const handleButton2Click = () => {
    !lockChoice && setBtn2Clicked(true)
    !lockChoice && setBtn1Clicked(false)
    set(
      ref(
        database,
        'users/' + `table${currentTable}/` + 'players/' + userAuthID
      ),
      {
        boxClicked: 2,
      }
    )

    setPlayerBox(2)
  }

  // Removing User
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      const userRef = ref(
        database,
        `users/table${currentTable}/players/${userAuthID}`
      )
      remove(userRef)
      setFromLivePage(false)
    }
  }
  const unMountCleanUp = async () => {
    const userRef = ref(
      database,
      `users/table${currentTable}/players/${userAuthID}`
    )
    await remove(userRef)
    console.log('unmounted called')
  }

  // Utils
  const calculateRingProgress = () => {
    const progress = (time / tableTime) * 100
    return progress
  }
  const handleShareClick = (e) => {
    e.stopPropagation()
    setModalHeader('Share and earn bonus! 💸')
    setModalContent('Share your referral link and earn bonus')
    setModalType('share')
    setModalOpen(true)
  }
  const getServerTime = () => {
    return Math.floor(Date.now() / 1000)
  }

  const updateTableDesign = () => {
    const tableTypeRef = ref(database, `users/table${currentTable}/tableType`)
    const tableDesignRef = ref(database, `users/table${currentTable}/design/`)
    const randomTable = generateRandomTable()
    set(tableTypeRef, randomTable.tableType)
    if (randomTable.tableType !== 'COINMOVE') {
      set(tableDesignRef, {
        bgColor: randomTable.bgColor,
        buttonsType: randomTable.buttonsType,
        resultType: randomTable.resultType,
      })
    }
  }

  // Bot choices set up
  function generateRandomChoices() {
    const numbers = []
    for (let i = 0; i < 3; i++) {
      numbers.push(Math.floor(Math.random() * 2) + 1)
    }
    return numbers
  }

  const resetBotChoices = () => {
    const randomChoice = generateRandomChoices()

    randomChoice.forEach((choice, index) => {
      set(
        ref(
          database,
          'users/' + `table${currentTable}/` + 'players/' + `bot${index}`
        ),
        {
          boxClicked: choice,
        }
      )
    })
  }

  // use Effects

  // timer
  useEffect(() => {
    // Get a reference to the Firebase Realtime Database 'timer' node
    const timerRef = ref(database, `timer${currentTable}`)

    // Read the initial value of the timer from the Firebase Realtime Database
    get(timerRef).then((snapshot) => {
      const initialTime = snapshot.val()
      if (initialTime !== 0) {
        setTime(initialTime)
      }
    })

    // Listen for updates to the timer value
    onValue(timerRef, (snapshot) => {
      setTime(snapshot.val())
    })

    // Clean up the Firebase Realtime Database reference when the component unmounts
    return () => {
      onValue(timerRef, () => {}) // Remove the listener
      if (time !== null) {
        set(ref(getDatabase(), `timer${currentTable}`), time) // Update the timer value on disconnect
        onDisconnect(ref(getDatabase(), `timer${currentTable}`)).cancel() // Cancel the onDisconnect event
      }
    }
  }, [])

  // timer, result, pause
  useEffect(() => {
    if (time === null) {
      return
    }

    // Automatically decrement the timer value every second
    let intervalId
    if (time > 0 && !isPaused) {
      intervalId = setInterval(() => {
        set(ref(getDatabase(), `timer${currentTable}`), time - 1)
      }, 1000)
      if (time === tableTime) {
        resetBotChoices()
        setPlayerBox(0)
      }
      if (time === 5) {
        if (tableTime !== 10) {
          setLockChoice(true)
          if (playerBox === -1 || playerBox === 0) {
            setIsSpectator(true)
            set(
              ref(
                database,
                'users/' + `table${currentTable}/` + 'players/' + userAuthID
              ),
              {
                boxClicked: 0,
              }
            )
          }
        }
      }
      if (time === 3) {
        if (tableTime === 10) {
          setLockChoice(true)
          if (playerBox === -1 || playerBox === 0) {
            setIsSpectator(true)
            set(
              ref(
                database,
                'users/' + `table${currentTable}/` + 'players/' + userAuthID
              ),
              {
                boxClicked: 0,
              }
            )
          }
        }
      }
    } else if (time === 0) {
      setFinalResultCalled(true)
      !finalResultCalled && finalResult()
      setIsPaused(true)
      setModalOpen(false)
      setShowResult(true)

      setTimeout(() => {
        set(ref(getDatabase(), `timer${currentTable}`), tableTime)
        setIsPaused(false)
        setFinalResultCalled(false)
        setShowResult(false)
        setIsSpectator(false)
        setLockChoice(false)

        // vertical table
        setBtn1Clicked(false)
        setBtn2Clicked(false)

        isFreeRound && setIsFreeRound(false)
        isBonusRound && setIsBonusRound(false)

        // getting times played
        get(ref(database, `users/table${currentTable}/playCount`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const playCount = snapshot.val()
              if (playCount % 25 === 0) {
                console.log('25th game')
                updateTableDesign()
              }
            } else {
              console.log('No data available')
            }
          })
          .catch((error) => {
            console.error(error)
          })

        // horizontal table
        const player = document.getElementById('player')
        player?.setAttribute('style', 'top: -51px')

        if (tokenBalance + bonusBalance < tableAmount) {
          navigate(`/table/${currentTable}/error`)
          setModalOpen(false)
        }
      }, 3000)
    }

    // Clean up the interval when the component unmounts or the timer value becomes null
    return () => clearInterval(intervalId)
  }, [time, isPaused, finalResultCalled])

  // Table Design Setup
  useEffect(() => {
    const tableTypeRef = ref(database, `users/table${currentTable}/tableType`)
    const bgColorRef = ref(
      database,
      `users/table${currentTable}/design/bgColor`
    )
    const buttonsTypeRef = ref(
      database,
      `users/table${currentTable}/design/buttonsType`
    )
    const resultTypeRef = ref(
      database,
      `users/table${currentTable}/design/resultType`
    )

    onValue(tableTypeRef, (snapshot) => {
      const tableType = snapshot.val()

      if (tableType) {
        setTableType('VERTICAL')
      }
    })
    onValue(buttonsTypeRef, (snapshot) => {
      const buttonsType = snapshot.val()
      if (buttonsType) {
        setTableButtonsType('TRIANGLE_LR')
      }
    })
    onValue(resultTypeRef, (snapshot) => {
      const resultType = snapshot.val()

      if (resultType) {
        setTableResultType(resultType)
      }
    })
    onValue(bgColorRef, (snapshot) => {
      const bgColorVal = snapshot.val()

      if (bgColorVal) {
        setTableBgColor(bgColorVal)
      }
    })
  }, [tableType, tableBgColor, tableButtonsType, tableResultType, tableType])

  // closing of tab listener
  useEffect(() => {
    // tableAmountSet()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      unMountCleanUp()
    }
  }, [])

  // Token Balance
  useEffect(() => {
    const userRef = doc(fireStore, 'users', userAuthID)
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const updatedTokenBalance = parseFloat(doc.data().tokenBalance)
        const updatedBonusBalance = parseFloat(doc.data().bonusBalance)
        setTokenBalance(updatedTokenBalance)
        setBonusBalance(updatedBonusBalance)

        if (updatedTokenBalance + updatedBonusBalance < tableAmount) {
          if (time > 0) navigate(`/table/${currentTable}/error`)
        }

        const currTableGamesPlayed =
          doc.data().tablesPlayedCount?.[`table${currentTable}Count`]

        // console.log(currTableGamesPlayed)

        if (currTableGamesPlayed % 20 === 0) {
          setIsFreeRound(true)
        }
      } else {
        console.log('No such document!')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [box1Ratio])

  // choose page redirect
  useEffect(() => {
    !fromLivePage && navigate('/live')
  }, [fromLivePage])

  const b1Style = 'h-[120px] w-[150px]'
  const b2Style = 'h-[120px] w-[150px]'

  const leftBtnStyle = 'relative left-[6%] xsm:left-[18%] h-[400px] w-[250px]'
  const leftBtnStyleForRoad = 'relative left-[50%] scale-200 h-[400px] w-[250px] mb-5'
  const rightBtnStyleForRoad = 'relative right-[51%] scale-200 h-[400px] w-[250px] mb-5'

  const rightBtnStyle =
    'relative right-[5%] top-[-11%] xsm:top-[-1%] xsm:right-[18%] h-[400px] w-[254px] '

  return userAuthID ? (
    loadingLiveUsers === true || loading === true ? (
      <LoadingSpinner />
    ) : (
      <div className='sm:w-[500px] h-[100vh] sm:mx-auto overflow-y-scroll overflow-x-hidden scrollbar-hide'>
        <div className='flex justify-between my-2 mx-1'>
          <Link to='/live'>
            <div className='mt-[5px]'>
              <ArrowLeftCircleIcon className='w-7 h-7 bg text-gray-500 arrow-svg' />
            </div>
          </Link>
          <div className='flex w-fit border ml-12 border-gray-300 px-3 py-1 bg-white rounded-xl shadow-sm ml-2'>
            <span
              className={`font-medium mr-2 text-lg py-[1px] ${
                isPaused && !isSpectator
                  ? result === 'win'
                    ? 'text-green-600'
                    : result === 'lose' && 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {(tokenBalance + bonusBalance).toFixed(4)}
            </span>
            <BitcoinIcon className='mt-[5px] w-[20px] h-[20px] text-yellow-500' />
          </div>
          <div className='flex w-fit border border-gray-300 px-3 py-1 bg-white rounded-xl shadow-sm'>
            <span className='font-medium mr-1 text-lg text-gray-600'>
              {tableAmount}
            </span>
            <span>
              <CircleStackIcon className='my-[5px] w-[20px] h-[18px] text-yellow-500' />
            </span>
          </div>
        </div>

        <div>
          {isSpectator ? (
            <OverlayMessage
              message='SPECTATOR 👁️'
              messageStyle='font-semibold text-gray-600'
              type={tableType}
            />
          ) : isPaused ? (
            <div className='text-center'>
              {result === 'win' ? (
                <OverlayImage
                  image={youWin}
                  type={tableType}
                />
              ) : result === 'lose' ? (
                <OverlayImage
                image={youLose}
                type={tableType}
              />
              ) : (
                <OverlayMessage
                  message='DRAWN 🏳️'
                  messageStyle='font-semibold text-blue-500'
                  type={tableType}
                />
              )}
            </div>
          ) : (
            lockChoice && (
              <OverlayMessage
                message='LOCKED 🔒'
                messageStyle='font-semibold text-gray-500'
                type={tableType}
              />
            )
          )}
        </div>

        {isFreeRound ? (
          <OverlayMessageRound
            message={'FREE ROUND'}
            messageStyle={'font-bold text-md text-yellow-500 '}
          />
        ) : (
          isBonusRound && (
            <OverlayMessageRound
              message={'BONUS ROUND'}
              messageStyle={'font-bold text-md text-blue-500 '}
            />
          )
        )}
        <div className='relative'>
          {isBonusRound && (
            <div>
              <img
                className='absolute top-0 right-0 h-[80vh] w-[15px] xsm:w-[20px] mt-4'
                src={rightBlueBorder}
                alt='right border'
              />
              <img
                className='absolute bottom-[-83vh] xsm:bottom-[-84vh] left-0 w-full pl-[2px]'
                src={bottomBlueBorder}
                alt='bottom border'
              />
              <img
                className='absolute top-0 left-0 h-[80vh] w-[15px] xsm:w-[20px] mt-4'
                src={leftBlueBorder}
                alt='left border'
              />
              <img
                className='absolute top-0 right-0 w-full'
                src={topBlueBorder}
                alt='top border'
              />
            </div>
          )}
        </div>
        <div className='relative'>
          {isFreeRound && (
            <div>
              <img
                className='absolute top-0 right-0  h-[81vh] xsm:h-[80vh] w-[12px] xsm:w-[13px] xsm:mr-[1px] mt-3 xsm:mt-4'
                src={rightGoldBorder}
                alt='right border'
              />
              <img
                className='absolute bottom-[-83vh] xsm:bottom-[-83vh] left-0 w-full ml-[1px] xsm:ml'
                src={bottomGoldBorder}
                alt='bottom border'
              />
              <img
                className='absolute top-0 left-0 h-[81vh] xsm:h-[80vh] w-[12px] xsm:w-[13px] mt-3 xsm:mt-4'
                src={leftGoldBorder}
                alt='left border'
              />
              <img
                className='absolute top-0 right-0 w-full'
                src={topGoldBorder}
                alt='top border'
              />
            </div>
          )}
        </div>
        {tableType === 'HORIZONTAL' ? (
          <div
            className={`relative ${
              isBonusRound ? 'pt-4 xsm:pt-5 px-4 xsm:px-5 pb-7 xsm:pb-5' : 'p-0'
            }
            ${
              isFreeRound ? 'pt-4 xsm:pt-4 px-4 xsm:px-3 pb-7 xsm:pb-5' : 'p-0'
            }`}
          >
            <div className='flex-col h-[90vh] w-full'>
              {/* box1 */}
              <div
                className={`relative z-0 
                  ${
                    isSpectator
                      ? 'border-[2px] border-black'
                      : 'border-[2px] border-gray-400'
                  } 
                  h-[44%] lg:rounded-t-md flex flex-col justify-between items-center  cursor-pointer ${
                    isPaused
                      ? tableResultType === 'BACKGROUND_COLORED'
                        ? playerBox === 0
                          ? box1Ratio < box2Ratio
                            ? 'bg-green-500'
                            : box1Ratio > box2Ratio
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                          : box1Ratio === box2Ratio
                          ? 'bg-gray-400'
                          : playerBox === 1 && box1Ratio < box2Ratio
                          ? 'bg-green-500'
                          : playerBox === 1 && box1Ratio > box2Ratio
                          ? 'bg-red-500'
                          : `bg-[${tableBgColor}]`
                        : `bg-[${tableBgColor}]`
                      : `bg-[${tableBgColor}]`
                  }`}
                onClick={() => !lockChoice && handleButton1Click()}
              >
                <div className='w-full'>
                  <div className='flex justify-between'>
                    <div className='h-fit flex py-1 px-2 rounded-lg ml-4 mt-4 bg-red-500'>
                      <UserGroupIcon className='w-4 h-5 text-white mr-2' />
                      <span className='font-semibold text-white text-[14px]'>
                        {liveUsers.length}{' '}
                        <span className='text-[13px]'>LIVE</span>
                      </span>
                    </div>

                    <div className='mr-2 mt-2'>
                      <ProgressRing
                        progress={calculateRingProgress()}
                        timer={time}
                        tableTime={tableTime}
                      />
                    </div>
                  </div>
                </div>
                <span className='text-[30px] text-white font-semibold'>
                  {tableButtonsType === 'TURQ_12' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <Button1TurqPressedRed className={b1Style} />
                        ) : box1Ratio < box2Ratio ? (
                          <Button1TurqPressedGreen className={b1Style} />
                        ) : (
                          <Button1TurqPressedNormal className={b1Style} />
                        )
                      ) : (
                        <Button1TurqPressedNormal className={b1Style} />
                      )
                    ) : (
                      <Button1Turq className={b1Style} />
                    )
                  ) : (
                    tableButtonsType === 'GRAY_12' &&
                    (btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <Button1GrayPressedRed className={b1Style} />
                        ) : box1Ratio < box2Ratio ? (
                          <Button1GrayPressedGreen className={b1Style} />
                        ) : (
                          <Button1GrayPressedNormal className={b1Style} />
                        )
                      ) : (
                        <Button1GrayPressedNormal className={b1Style} />
                      )
                    ) : (
                      <Button1Gray className={b1Style} />
                    ))
                  )}
                </span>
                <div></div>
              </div>

              {/* box1 res */}
              <div
                className={`relative top-[-70px] left-[-35%] z-10 w-full flex flex-row justify-center  ${
                  showResult ? 'visible' : 'invisible'
                } `}
              >
                <div className='rounded-md border border-gray-600 text-gray-600 font-bold shadow-md px-3 py-1 bg-white'>
                  {box1Ratio} %
                </div>
              </div>

              <div
                className={`relative top-[-51px] z-10 w-full flex flex-row justify-center invisible `}
              >
                <BitcoinIcon className='w-[35px] h-[35px] rounded-full text-yellow-500 bg-white shadow-lg' />
              </div>

              {/* box2 res */}
              <div
                className={`relative top-[-27px] left-[-35%] z-10 w-full flex flex-row justify-center ${
                  showResult ? 'visible' : 'invisible'
                }`}
              >
                <div className='rounded-md border border-gray-600 text-gray-600 font-bold shadow-md px-3 py-1 bg-white'>
                  {box2Ratio} %
                </div>
              </div>

              {/* box2 */}
              <div
                className={`relative top-[-103px] z-0 
            ${
              isSpectator
                ? 'border-x-[2px] border-b-[1px] border-black'
                : 'border-x-[2px] border-b-[1px] border-gray-400'
            } 
            h-[44%] flex flex-col justify-center items-center text-2xl lg:rounded-b-md cursor-pointer ${
              isPaused
                ? tableResultType === 'BACKGROUND_COLORED'
                  ? playerBox === 0
                    ? box1Ratio < box2Ratio
                      ? 'bg-red-500'
                      : box1Ratio > box2Ratio
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                    : box1Ratio === box2Ratio
                    ? 'bg-gray-400'
                    : playerBox === 2 && box1Ratio < box2Ratio
                    ? 'bg-red-500'
                    : playerBox === 2 && box1Ratio > box2Ratio
                    ? 'bg-green-500'
                    : `bg-[${tableBgColor}]`
                  : `bg-[${tableBgColor}]`
                : `bg-[${tableBgColor}]`
            }`}
                onClick={() => !lockChoice && handleButton2Click()}
              >
                <span className='text-[30px] mb-[17px] font-semibold  text-white'>
                  {tableButtonsType === 'TURQ_12' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <Button2TurqPressedRed className={b2Style} />
                        ) : box1Ratio > box2Ratio ? (
                          <Button2TurqPressedGreen className={b2Style} />
                        ) : (
                          <Button2TurqPressedNormal className={b2Style} />
                        )
                      ) : (
                        <Button2TurqPressedNormal className={b2Style} />
                      )
                    ) : (
                      <Button2Turq className={b2Style} />
                    )
                  ) : tableButtonsType === 'GRAY_12' && btn2Clicked ? (
                    isPaused && tableResultType === 'BUTTON_COLORED' ? (
                      box1Ratio < box2Ratio ? (
                        <Button2GrayPressedRed className={b2Style} />
                      ) : box1Ratio > box2Ratio ? (
                        <Button2GrayPressedGreen className={b2Style} />
                      ) : (
                        <Button2GrayPressedNormal className={b2Style} />
                      )
                    ) : (
                      <Button2GrayPressedNormal className={b2Style} />
                    )
                  ) : (
                    <Button2Gray className={b2Style} />
                  )}
                </span>
              </div>
              <span className='fixed bottom-[85px] right-0 mb-4 mr-4'>
                <div
                  className='border-[1px] p-3 border-gray-700 rounded-full shadow-md bg-white'
                  onClick={(e) => handleShareClick(e)}
                >
                  <ShareIcon className='w-6 h-5 text-gray-700' />
                </div>
              </span>
            </div>
          </div>
        ) : tableType === 'VERTICAL' ? (
          <div
            className={`relative ${
              isBonusRound || isFreeRound
                ? 'pt-4 xsm:pt-5 px-4 xsm:px-5 pb-7 xsm:pb-5'
                : 'p-0'
            }`}
          >
            <div className='flex h-[80vh] w-full mb-10 '>
              {/* box1 */}
              <div
                className={`relative h-full w-[50%] z-0 
               ${
                 isSpectator
                   ? 'border-[1px] border-black'
                   : 'border-[1px] border-gray-400'
               } 
              flex flex-col justify-between items-center md:rounded-l-md ${
                isPaused
                  ? tableResultType === 'BACKGROUND_COLORED'
                    ? playerBox === 0
                      ? box1Ratio < box2Ratio
                        ? 'bg-green-500'
                        : box1Ratio > box2Ratio
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                      : box1Ratio === box2Ratio
                      ? 'bg-gray-400'
                      : playerBox === 1 && box1Ratio < box2Ratio
                      ? 'bg-green-500'
                      : playerBox === 1 && box1Ratio > box2Ratio
                      ? 'bg-red-500'
                      : `bg-[${tableBgColor}]`
                    : `bg-[${tableBgColor}]`
                  : `bg-[${tableBgColor}]`
              }`}
                onClick={(e) => !lockChoice && handleButton1Click(e)}
              >
                <div className='self-start'>
                  <div className='h-fit flex py-1 px-2 rounded-lg ml-4 mt-4 bg-red-500'>
                    <UserGroupIcon className='w-4 h-5 text-white mr-2' />
                    <span className='font-semibold text-white text-[14px]'>
                      {liveUsers.length}{' '}
                      <span className='text-[13px]'>LIVE</span>
                    </span>
                  </div>
                </div>
                <span className='text-[30px] text-gray-600 font-semibold'>
                  {tableButtonsType === 'PINK_LR' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <RedLeft className={leftBtnStyle} />
                        ) : box1Ratio < box2Ratio ? (
                          <GreenLeft className={leftBtnStyle} />
                        ) : (
                          <LeftPinkPressed className={leftBtnStyle} />
                        )
                      ) : (
                        <LeftPinkPressed className={leftBtnStyle} />
                      )
                    ) : (
                      <LeftPink className={leftBtnStyle} />
                    )
                  ) : tableButtonsType === 'YELLOW_LR' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <RedLeft className={leftBtnStyle} />
                        ) : box1Ratio < box2Ratio ? (
                          <GreenLeft className={leftBtnStyle} />
                        ) : (
                          <LeftYellowPressed
                            className={`z-10 ${leftBtnStyle}`}
                          />
                        )
                      ) : (
                        <LeftYellowPressed className={leftBtnStyle} />
                      )
                    ) : (
                      <LeftYellow className={`z-10 ${leftBtnStyle}`} />
                    )
                  ) : tableButtonsType === 'ROAD_LR' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <img src={leftRoadLoseGif}
                      className={`${leftBtnStyleForRoad}`}
                    />
                        ) : box1Ratio < box2Ratio ? (
                          <>
                      <OverlayCoin image={leftCoin}/>

                          <img src={leftRoadWonGif}
                      className={`${leftBtnStyleForRoad}`}
                    /></>
                        ) : (
                          <img src={leftRoadPressedGif}
                      className={`${leftBtnStyleForRoad}`}
                    />
                        )
                      ) : 
                      <LeftImageSwapper first={leftRoadPressedGif} second={leftRoadTimerGif}/>
                    ) :
                     (
                      <Road className={`relative xsm: h-[400px] w-[250px]`} />
                    )
                    
                  ): tableButtonsType === 'TRIANGLE_LR' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <img src={leftTriangleLocked}
                          className={`relative left-[128px] h-[400px] w-[250px] mr-10 scale-200`}
                        />
                        ) : box1Ratio < box2Ratio ? (
                          <>
                      <OverlayCoin image={leftCoin}/>

                      <img src={leftTriangleLocked}
                      className={`relative left-[128px] h-[400px] w-[250px] mr-10 scale-200`}
                    /></>
                        ) : (
                          <img src={leftTriangleLocked}
                          className={`relative left-[128px] h-[400px] w-[250px] mr-10 scale-200`}
                        />
                        )
                      ) : 
                      <LeftImageSwapper first={leftTrianglePressed} second={leftTriangleLocked}/>
                    ) : (
                      <LeftTriangle className={`relative ml-[250px] h-[400px] w-[250px] scale-200`} />
                    )
                  ): tableButtonsType === 'EARTH_LR' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <img src={earthPressedGif}
                      className={`${leftBtnStyle} scale-200`}
                    />
                        ) : box1Ratio < box2Ratio ? (
                          <>
                      <OverlayCoin image={leftCoin}/>

                          <img src={earthPressedGif}
                      className={`${leftBtnStyle} scale-200`}
                    /></>
                        ) : (
                          <img src={earthPressedGif}
                      className={`${leftBtnStyle} scale-200`}
                    />
                        )
                      ) : 
                      <LeftImageSwapper first={earthGif} second={earthPressedGif}/>
                    ) : (
                      <Earth className={`relative left-[115px] h-[400px] w-[250px] scale-200`} />
                    )
                  ):tableButtonsType === 'TURQ_12' ? (
                    btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <Button1TurqPressedRed className={b1Style} />
                        ) : box1Ratio < box2Ratio ? (
                          <Button1TurqPressedGreen className={b1Style} />
                        ) : (
                          <Button1TurqPressedNormal className={b1Style} />
                        )
                      ) : (
                        <Button1TurqPressedNormal className={b1Style} />
                      )
                    ) : (
                      <Button1Turq className={b1Style} />
                    )
                  ) : (
                    tableButtonsType === 'GRAY_12' &&
                    (btn1Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio > box2Ratio ? (
                          <Button1GrayPressedRed className={b1Style} />
                        ) : box1Ratio < box2Ratio ? (
                          <Button1GrayPressedGreen className={b1Style} />
                        ) : (
                          <Button1GrayPressedNormal className={b1Style} />
                        )
                      ) : (
                        <Button1GrayPressedNormal className={b1Style} />
                      )
                    ) : (
                      <Button1Gray className={b1Style} />
                    ))
                  )}
                  {/* box1 res */}
                  <div
                    className={`flex flex-row relative top-[10%] left-[10%] justify-center ${
                      showResult ? 'visible' : 'invisible'
                    } `}
                  >
                    <div className='rounded-md border border-gray-300 text-gray-600 shadow-md px-3 py-1 bg-white  text-[17px]'>
                      {box1Ratio} %
                    </div>
                  </div>
                </span>
                <div></div>
              </div>

              {/* box2 */}
              <div
                className={`relative h-full w-[50%] z-0 
              ${
                isSpectator
                  ? 'border-y-[1px] border-r-[1px] border-black'
                  : 'border-y-[1px] border-r-[1px] border-gray-400'
              } 
              flex flex-col justify-between items-center md:rounded-r-md ${
                isPaused
                  ? tableResultType === 'BACKGROUND_COLORED'
                    ? playerBox === 0
                      ? box1Ratio < box2Ratio
                        ? 'bg-red-500'
                        : box1Ratio > box2Ratio
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                      : box1Ratio === box2Ratio
                      ? 'bg-gray-400'
                      : playerBox === 2 && box1Ratio < box2Ratio
                      ? 'bg-red-500'
                      : playerBox === 2 && box1Ratio > box2Ratio
                      ? 'bg-green-500'
                      : `bg-[${tableBgColor}]`
                    : `bg-[${tableBgColor}]`
                  : `bg-[${tableBgColor}]`
              }`}
                onClick={() => !lockChoice && handleButton2Click()}
              >
                <div className='self-end mr-2 mt-3 mb-[48px]'>
                  <ProgressRing
                    progress={calculateRingProgress()}
                    timer={time}
                    tableTime={tableTime}
                  />
                </div>
                <span className='text-[30px] mb-[50px] text-gray-600 font-semibold '>
                  {tableButtonsType === 'PINK_LR' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <RedRight className={rightBtnStyle} />
                        ) : box1Ratio > box2Ratio ? (
                          <GreenRight className={rightBtnStyle} />
                        ) : (
                          <RightPinkPressed className={rightBtnStyle} />
                        )
                      ) : (
                        <RightPinkPressed className={rightBtnStyle} />
                      )
                    ) : (
                      <RightPink className={rightBtnStyle} />
                    )
                  ) : tableButtonsType === 'YELLOW_LR' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <RedRight
                            className={`${rightBtnStyle} w-[156px] right-[8%]`}
                          />
                        ) : box1Ratio > box2Ratio ? (
                          <GreenRight
                            className={`${rightBtnStyle} w-[156px] right-[8%]`}
                          />
                        ) : (
                          <RightYellowPressed
                            className={`${rightBtnStyle} w-[156px] right-[8%]`}
                          />
                        )
                      ) : (
                        <RightYellowPressed
                          className={`${rightBtnStyle} w-[156px] right-[8%]`}
                        />
                      )
                    ) : (
                      <RightYellow className={`${rightBtnStyle}`} />
                    )
                  ) : tableButtonsType === 'ROAD_LR' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <img src={rightRoadLoseGif}
                          className={`${rightBtnStyleForRoad}`}
                        />
                        ) : box1Ratio > box2Ratio ? (
                          <>
                      <OverlayCoin image={rightCoin}/>

                          <img src={rightRoadWonGif}
                          className={`${rightBtnStyleForRoad}`}
                        /></>
                        ) : (
                          <img src={rightRoadPressedGif}
                          className={`${rightBtnStyleForRoad}`}
                        />
                        )
                      ) : 
                      <RightImageSwapper first={rightRoadPressedGif} second={rightRoadTimerGif}/>
                    ) : (
                      <Road transform="scale(-1,1)" className={'left-[-1%] h-[400px] w-[250px]'} />
                    )
                  ): tableButtonsType === 'TRIANGLE_LR' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <img src={rightTriangleLocked}
                          className={`left-[-128px] ${rightBtnStyle} scale-200`}
                        />
                        ) : box1Ratio > box2Ratio ? (
                          <>
                      <OverlayCoin image={rightCoin}/>

                      <img src={rightTriangleLocked}
                          className={`left-[-128px] ${rightBtnStyle} scale-200`}
                        /></>
                        ) : (
                          <img src={rightTriangleLocked}
                          className={`left-[-128px] ${rightBtnStyle} scale-200`}
                        />
                        )
                      ) : <RightImageSwapper first={rightTrianglePressed} second={rightTriangleLocked}/>
                    ) : (
                      <RightTriangle className={'relative mr-[250px] h-[400px] w-[250px] mb-[25px] scale-200'} />
                    )
                  ) : tableButtonsType === 'EARTH_LR' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <img src={flatEarthPressedGif}
                          className={`${rightBtnStyle} scale-150`}
                        />
                        ) : box1Ratio > box2Ratio ? (
                          <>
                      <OverlayCoin image={rightCoin}/>

                          <img src={flatEarthPressedGif}
                          className={`${rightBtnStyle} scale-150`}
                        /></>
                        ) : (
                          <img src={flatEarthPressedGif}
                          className={`${rightBtnStyle} scale-150`}
                        />
                        )
                      ) : (
                        <RightImageSwapper first={flatEarthGif} second={flatEarthPressedGif}/>
                      )
                    ) : (
                      <Flat_Earth className={'h-[400px] w-[250px] mr-[215px] mb-[30px] scale-200'} />
                    )
                  ) : tableButtonsType === 'TURQ_12' ? (
                    btn2Clicked ? (
                      isPaused && tableResultType === 'BUTTON_COLORED' ? (
                        box1Ratio < box2Ratio ? (
                          <Button2TurqPressedRed className={b2Style} />
                        ) : box1Ratio > box2Ratio ? (
                          <Button2TurqPressedGreen className={b2Style} />
                        ) : (
                          <Button2TurqPressedNormal className={b2Style} />
                        )
                      ) : (
                        <Button2TurqPressedNormal className={b2Style} />
                      )
                    ) : (
                      <Button2Turq className={b2Style} />
                    )
                  ) : tableButtonsType === 'GRAY_12' && btn2Clicked ? (
                    isPaused && tableResultType === 'BUTTON_COLORED' ? (
                      box1Ratio < box2Ratio ? (
                        <Button2GrayPressedRed className={b2Style} />
                      ) : box1Ratio > box2Ratio ? (
                        <Button2GrayPressedGreen className={b2Style} />
                      ) : (
                        <Button2GrayPressedNormal className={b2Style} />
                      )
                    ) : (
                      <Button2GrayPressedNormal className={b2Style} />
                    )
                  ) : (
                    <Button2Gray className={b2Style} />
                  )}
                  {/* box2 res */}
                  <div
                    className={`w-full flex flex-row relative top-[10%] right-[10%] justify-center ${
                      showResult ? 'visible' : 'invisible'
                    }`}
                  >
                    <div className='rounded-md border border-gray-300 text-gray-600 shadow-md px-3 py-1 bg-white text-[17px]'>
                      {box2Ratio} %
                    </div>
                  </div>
                </span>
              </div>
              <span className='fixed bottom-[85px] right-0 md:right-[28%] lg:right-[34%] sm:bottom-[15%] mb-4 mr-4'>
                <div
                  className='border-[1px] p-3 border-gray-700 rounded-full shadow-md bg-white'
                  onClick={(e) => handleShareClick(e)}
                >
                  <ShareIcon className='w-6 h-5 text-gray-700' />
                </div>
              </span>
            </div>
          </div>
        ) : (
          <div className='flex-col mt-6 h-[70vh] w-full'>
            <div className='w-full mb-5'>
              <div className='flex justify-between'>
                <div className='h-fit flex py-1 px-2 rounded-lg ml-4 mt-4 bg-red-500'>
                  <UserGroupIcon className='w-4 h-5 text-white mr-2' />
                  <span className='font-semibold text-white text-[14px]'>
                    {liveUsers.length} <span className='text-[13px]'>LIVE</span>
                  </span>
                </div>

                <div className='mr-2 mt-2'>
                  <ProgressRing
                    progress={calculateRingProgress()}
                    timer={time}
                    tableTime={tableTime}
                    outside={true}
                  />
                </div>
              </div>
            </div>
            {/* box1 */}
            <div
              className={`relative z-0 
            ${
              isSpectator
                ? 'border-[3px] border-black'
                : 'border-[2px] border-gray-400'
            } 
            h-[44%] rounded-t-md flex flex-col justify-center items-center text-2xl cursor-pointer ${
              isPaused
                ? playerBox === 0
                  ? box1Ratio < box2Ratio
                    ? 'bg-green-500'
                    : box1Ratio > box2Ratio
                    ? 'bg-red-500'
                    : 'bg-gray-400'
                  : box1Ratio === box2Ratio
                  ? 'bg-gray-400'
                  : playerBox === 1 && box1Ratio < box2Ratio
                  ? 'bg-green-500'
                  : playerBox === 1 && box1Ratio > box2Ratio
                  ? 'bg-red-500'
                  : 'bg-[#3A3B3C]'
                : 'bg-[#3A3B3C]'
            }`}
              onClick={() => !lockChoice && handleBox1Click()}
            >
              <span className='text-[30px] text-white font-semibold'>1</span>
            </div>

            {/* box1 res */}
            <div
              className={`relative top-[-70px] left-[-35%] z-10 w-full flex flex-row justify-center  ${
                showResult ? 'visible' : 'invisible'
              } `}
            >
              <div className='rounded-md border border-gray-300 text-gray-600 shadow-md px-3 py-1 bg-white'>
                {box1Ratio} %
              </div>
            </div>

            {/* player */}
            <div
              id='player'
              className={`relative top-[-51px] z-10 w-full flex flex-row justify-center ${
                isSpectator ? 'invisible' : 'visible'
              } `}
            >
              <BitcoinIcon className='w-[35px] h-[35px] rounded-full text-yellow-500 bg-white shadow-lg' />
            </div>

            {/* box2 res */}
            <div
              className={`relative top-[-35px] left-[-35%] z-10 w-full flex flex-row justify-center ${
                showResult ? 'visible' : 'invisible'
              }`}
            >
              <div className='rounded-md border border-gray-300 text-gray-600 shadow-md px-3 py-1 bg-white'>
                {box2Ratio} %
              </div>
            </div>

            {/* box2 */}
            <div
              className={`relative top-[-103px] z-0 
            ${
              isSpectator
                ? 'border-x-[3px] border-b-[3px] border-black'
                : 'border-x-[2px] border-b-[2px] border-gray-400'
            } 
            h-[44%] flex flex-col justify-center items-center text-2xl rounded-b-md cursor-pointer ${
              isPaused
                ? playerBox === 0
                  ? box1Ratio < box2Ratio
                    ? 'bg-red-500'
                    : box1Ratio > box2Ratio
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                  : box1Ratio === box2Ratio
                  ? 'bg-gray-400'
                  : playerBox === 2 && box1Ratio < box2Ratio
                  ? 'bg-red-500'
                  : playerBox === 2 && box1Ratio > box2Ratio
                  ? 'bg-green-500'
                  : 'bg-[#3A3B3C]'
                : 'bg-[#3A3B3C]'
            }`}
              onClick={() => !lockChoice && handleBox2Click()}
            >
              <span className='text-[30px] font-semibold mt-11 text-white'>
                2
              </span>
              <span className='z-10 relative top-[17%] left-[39%] cursor-pointer'>
                <div
                  className='border-[1px] p-3 border-gray-400 rounded-full shadow-md bg-gray-50'
                  onClick={(e) => handleShareClick(e)}
                >
                  <ShareIcon className='w-6 h-5 text-gray-500' />
                </div>
              </span>
            </div>
          </div>
        )}
        <Popup />
      </div>
    )
  ) : (
    <NotAuthorised />
  )
}

export default TablePage
