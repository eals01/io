import { useState, useRef, useEffect } from 'react'
import { socket } from '../../socket'

import Chat from '../../components/Chat'
import Swap from './components/Swap'
import Card from './components/Card'

import './GameRoom.scss'

const image = 'data:image/png;base64,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'

const GameRoom = () => {
    useEffect(() => {
        socket.emit('request-game-room')

        socket.on('update-game', gameState => {
            setHand(gameState.hand)

            let newOpponentHand = []
            for(let i = 0; i < gameState.opponentHands[0]; i++) {
                newOpponentHand.push(0)
            }
            setOpponentHandLeft(newOpponentHand)

            let newOpponentHand2 = []
            for(let i = 0; i < gameState.opponentHands[1]; i++) {
                newOpponentHand2.push(0)
            }
            setOpponentHandMiddle(newOpponentHand2)

            let newOpponentHand3 = []
            for(let i = 0; i < gameState.opponentHands[2]; i++) {
                newOpponentHand3.push(0)
            }
            setOpponentHandRight(newOpponentHand3)

            setPlayStack(gameState.playStack)

            let newDrawStack = []
            for(let i = 0; i < gameState.drawStack; i++) {
                newDrawStack.push(1)
            }
            setDrawStack(newDrawStack)
        })

        socket.on('update-users', users => {
            setUsers(users)
        })
    }, [])

    const [users, setUsers] = useState([{'name': '', 'image': ''}, {'name': '', 'image': ''}, {'name': '', 'image': ''}, {'name': '', 'image': ''}])
    const [hand, setHand] = useState([])
    const [opponentHandLeft, setOpponentHandLeft] = useState([])
    const [opponentHandMiddle, setOpponentHandMiddle] = useState([])
    const [opponentHandRight, setOpponentHandRight] = useState([])
    const [drawStack, setDrawStack] = useState([])
    const [playStack, setPlayStack] = useState([])
    const [degrees, setDegrees] = useState([])

    const handRef = useRef()
    const opponentHandLeftRef = useRef()
    const opponentHandMiddleRef = useRef()
    const opponentHandRightRef = useRef()
    const playStackRef = useRef()
    const drawStackRef = useRef()

    // position draw stack UI
    useEffect(() => {
        let drawStackArray = Array.from(drawStackRef.current.children)
        let difference = 0
        for(let i in drawStackArray) {
            drawStackArray[i].style.bottom = difference + 'px'
            difference += 1
        }
    }, [drawStack])

    // position play stack UI
    const addDegree = () => {
        let newDegrees = degrees.slice()
        newDegrees.push(Math.floor(Math.random() * 30 - 15))
        setDegrees(newDegrees)
    }

    useEffect(() => {
        let playStackArray = Array.from(playStackRef.current.children)
        let difference = 0
        for(let i in playStackArray) {
            addDegree() // den adder duplicates for hver nye
            playStackArray[i].style.bottom = difference + 'px'
            playStackArray[i].style.transform = `perspective(700px) rotateX(45deg) rotateZ(${degrees[i]}deg)`
            playStackArray[playStackArray.length - 1].style.transform = `perspective(700px) rotateX(45deg) rotateZ(${degrees[i]}deg)`
            difference += 1
        }
    }, [playStack])

    // position hand UI
    useEffect(() => {
        let handArray = Array.from(handRef.current.children)
        let difference = 0
        let span = 8
        let degreeDifference = span / 2 * -1
        let degreeDifferenceValue = span / handArray.length
        for(let i in handArray) {
            handArray[i].style.transform = `translateX(${difference}px) translateY(${Math.pow(- degreeDifference, 2) / 2}px) rotateZ(${degreeDifference}deg)`
            difference += 60
            degreeDifference += degreeDifferenceValue
            handArray[i].addEventListener('mouseover', e => {
                e.target.style.top = '-30px'
            })
            handArray[i].addEventListener('mouseout', e => {
                e.target.style.top = '0px'
            })
        }
        handRef.current.style.width = 60 * (handArray.length - 1) + 180 + 'px'
    }, [hand])

    // position left opponent hand UI
    useEffect(() => {
        let handArray = Array.from(opponentHandLeftRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 50
        }
        opponentHandLeftRef.current.style.width = 50 * (handArray.length - 1) + 180 + 'px'
        opponentHandLeftRef.current.style.left = (opponentHandLeftRef.current.style.width / 2) + 'px'
    }, [opponentHandLeft])
    
     // position middle opponent hand UI
     useEffect(() => {
        let handArray = Array.from(opponentHandMiddleRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 65
        }
        opponentHandMiddleRef.current.style.width = 65 * (handArray.length - 1) + 180 + 'px'
    }, [opponentHandMiddle])

     // position right opponent hand UI
     useEffect(() => {
        let handArray = Array.from(opponentHandRightRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 50
        }
        opponentHandRightRef.current.style.width = 50 * (handArray.length - 1) + 180 + 'px'
    }, [opponentHandRight])

    // handle card click
    function handleClick(i) {
        socket.emit('play-card', i)
    }

    // handle draw
    const handleDraw = () => {
        socket.emit('request-card')
    }

    useEffect(() => {
        socket.on('deal-card', card => {

        })
    }, [])

    return (
        <div className='tableContainer'>
            <div className='table'>
                <button className='drawButton' onClick={handleDraw}>Draw</button>
                <div className='stacks'>
                    <div ref={drawStackRef} className='stack drawStack'>
                        {drawStack.map(() => <Card value='EE'/>)}
                    </div>
                    <div ref={playStackRef} className='stack playStack'>
                        {playStack.map(card => <Card value={card}/>)}
                    </div>
                </div>
                <div ref={opponentHandLeftRef} className='shadow opponentHand opponentHandLeft'>
                    {opponentHandLeft.map(card => <Card value='EE' />)}
                </div>
                <div ref={opponentHandMiddleRef} className='shadow opponentHand opponentHandMiddle'>
                    {opponentHandMiddle.map(card => <Card value='EE' />)}
                </div>
                <div ref={opponentHandRightRef} className='shadow opponentHand opponentHandRight'>
                    {opponentHandRight.map(card => <Card value='EE' />)}
                </div>
                <div ref={handRef} className='shadow hand'>
                    {hand.map(card => <Card value={card} hand={handRef.current} handleclick={handleClick} />)}
                </div>
                <div className='user opponent1'>
                    <img src={users[0].image} />
                    <span style={{color: users[0].color}}>{users[0].name}</span>
                </div>
                <div className='user opponent2'>
                    <img src={users[0].image} />
                    <span style={{color: users[0].color}}>{users[0].name}</span>
                </div>
                <div className='user opponent3'>
                    <img src={users[0].image} />
                    <span style={{color: users[0].color}}>{users[0].name}</span>
                </div>
                <div className='user player'>
                    <img src={users[0].image} />
                    <span style={{color: users[0].color}}>{users[0].name}</span>
                </div>
                <Chat />
                <Swap />
            </div>
        </div>
    )
}

export default GameRoom