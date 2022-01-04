import { useState, useRef, useEffect } from 'react'
import { socket } from '../../socket'

import Chat from '../../components/Chat'
import Swap from './components/Swap'
import Card from './components/Card'

import './GameRoom.scss'

const GameRoom = () => {
    useEffect(() => {
        socket.emit('request-game-room')

        socket.on('update-game', gameState => {
            console.log('her kommern')
            console.log(gameState)
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
    }, [])

    const [hand, setHand] = useState([])
    const [opponentHandLeft, setOpponentHandLeft] = useState([])
    const [opponentHandMiddle, setOpponentHandMiddle] = useState([])
    const [opponentHandRight, setOpponentHandRight] = useState([])
    const [drawStack, setDrawStack] = useState(['EE'])
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
    useEffect(() => {
        let playStackArray = Array.from(playStackRef.current.children)
        let difference = 0
        for(let i in playStackArray) {
            let newDegrees = degrees.slice()
            newDegrees.push(Math.floor(Math.random() * 30 - 15))
            setDegrees(newDegrees)
            playStackArray[i].style.bottom = difference + 'px'
            playStackArray[i].style.transform = `perspective(700px) rotateX(45deg) rotateZ(${degrees[i]}deg)`
            difference += 1
        }
    }, [playStack, setPlayStack])

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
            difference += 70
        }
        opponentHandLeftRef.current.style.width = 70 * (handArray.length - 1) + 180 + 'px'
    }, [opponentHandLeft])
    
     // position middle opponent hand UI
     useEffect(() => {
        let handArray = Array.from(opponentHandMiddleRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 70
        }
        opponentHandMiddleRef.current.style.width = 70 * (handArray.length - 1) + 180 + 'px'
    }, [opponentHandMiddle])

     // position right opponent hand UI
     useEffect(() => {
        let handArray = Array.from(opponentHandRightRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 70
        }
        opponentHandRightRef.current.style.width = 70 * (handArray.length - 1) + 180 + 'px'
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
            <Chat />
            <Swap />
        </div>
    )
}

export default GameRoom