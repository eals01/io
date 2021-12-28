import { useState, useRef, useEffect } from 'react'

import Card from './components/Card'

import './GameRoom.scss'

const stack = [
    'R0','R1','R1','R2','R2','R3','R3','R4','R4','R5','R5','R6','R6','R7','R7','R8','R8','R9','R9','RB','RB','RR','RR','RP2','RP2',
    'Y0','Y1','Y1','Y2','Y2','Y3','Y3','Y4','Y4','Y5','Y5','Y6','Y6','Y7','Y7','Y8','Y8','Y9','Y9','YB','YB','YR','YR','YP2','YP2',
    'G0','G1','G1','G2','G2','G3','G3','G4','G4','G5','G5','G6','G6','G7','G7','G8','G8','G9','G9','GB','GB','GR','GR','GP2','GP2',
    'B0','B1','B1','B2','B2','B3','B3','B4','B4','B5','B5','B6','B6','B7','B7','B8','B8','B9','B9','BB','BB','BR','BR','BP2','BP2',
    'XS','XS','XS','XS','XP4','XP4','XP4','XP4'
]

const GameRoom = () => {
    const [hand, setHand] = useState([])
    const [drawStack, setDrawStack] = useState(['EE'])
    const [playStack, setPlayStack] = useState(['Y5'])

    const handRef = useRef()
    const playStackRef = useRef()
    const drawStackRef = useRef()

    const drawCard = () => {
        const i = Math.floor(Math.random()*drawStack.length)
        const value = drawStack[i]
        drawStack.splice(i, 1)
        return value
    }

    // initiate draw stack
    useEffect(() => {
        setDrawStack(stack)
    })

    // populate draw stack UI
    useEffect(() => {
        let drawStackArray = Array.from(drawStackRef.current.children)
        let difference = 0
        for(let i in drawStackArray) {
            drawStackArray[i].style.bottom = difference + 'px'
            difference += .6
        }
    })

    // populate play stack UI
    useEffect(() => {
        let playStackArray = Array.from(playStackRef.current.children)
        let difference = 0
        for(let i in playStackArray) {
            playStackArray[i].style.bottom = difference + 'px'
            difference += .6
        }
    })

    // populate hand UI
    useEffect(() => {
        let handArray = Array.from(handRef.current.children)
        let difference = 0
        for(let i in handArray) {
            handArray[i].style.left = difference + 'px'
            difference += 70

            handArray[i].addEventListener('click', () => {
                let newPlayStack = playStack.slice()
                newPlayStack.push(hand[i])
                setPlayStack(newPlayStack)

                let newHand = hand.slice()
                newHand.splice(i, 1)
                setHand(newHand)
            })
        }
        handRef.current.style.width = 70 * (handArray.length - 1) + 180 + 'px'
    }, [hand, setHand])

    const handleDraw = () => {
        let newHand = hand.slice()
        newHand.push(drawCard())
        setHand(newHand)
    }

    return (
        <div className='table'>
            <button onClick={handleDraw}>Draw</button>
            <div className='stacks'>
                <div ref={drawStackRef} className='stack drawStack'>
                    {stack.map(card => <Card value='EE'/>)}
                </div>
                <div ref={playStackRef} className='stack playStack'>
                    {playStack.map(card => <Card value={card}/>)}
                </div>
            </div>
            <div ref={handRef} className='hand'>
                {hand.map(card => <Card value={card}/>)}
            </div>
        </div>
    )
}

export default GameRoom