import { useState, useRef, useEffect } from 'react'

import Card from './components/Card'

import './GameRoom.scss'

const stack = [
    'R0','R1','R1','R2','R2','R3','R3','R4','R4','R5','R5','R6','R6','R7','R7','R8','R8','R9','R9','RB','RB','RR','RR','RP','RP',
    'Y0','Y1','Y1','Y2','Y2','Y3','Y3','Y4','Y4','Y5','Y5','Y6','Y6','Y7','Y7','Y8','Y8','Y9','Y9','YB','YB','YR','YR','YP','YP',
    'G0','G1','G1','G2','G2','G3','G3','G4','G4','G5','G5','G6','G6','G7','G7','G8','G8','G9','G9','GB','GB','GR','GR','GP','GP',
    'B0','B1','B1','B2','B2','B3','B3','B4','B4','B5','B5','B6','B6','B7','B7','B8','B8','B9','B9','BB','BB','BR','BR','BP','BP',
    'XC','XC','XC','XC','XF','XF','XF','XF'
]

const handStyle = {
    '&:hover': {
        transform: 'translateY(-50px)',
        outline: '3px solid white'
    }
}

const GameRoom = () => {
    const [opponentHands, setOpponentHands] = useState([])
    const [hand, setHand] = useState([])
    const [playStack, setPlayStack] = useState([])

    const stackRef = useRef()
    const playStackRef = useRef()
    const handRef = useRef()
    const opponentHandLeftRef = useRef()
    const opponentHandTopRef = useRef()
    const opponentHandRightRef = useRef()

    useEffect(() => {
        let stack = Array.from(stackRef.current.children)
        let difference = 0
        for(let i in stack) {
            stack[i].style.boxShadow = '0px 2px 2px -3px rgba(0,0,0,0.8)'
            stack[i].style.transform = `translateY(${difference}px)`
            difference -= .8
        }
        stack[0].style.boxShadow = '0px 3px 6px 2px rgba(0,0,0,0.3)'
    }, [])

    useEffect(() => {
        let playStack = Array.from(playStackRef.current.children)
        playStack[0].style.boxShadow = '0px 3px 6px 2px rgba(0,0,0,0.3)'
    }, [])

    useEffect(() => {
        let hand = Array.from(handRef.current.children)
        let difference = 0
        for(let i in hand) {
            hand[i].style.left = difference + 'px'
            difference += 80

            if(i != 0) {
                hand[i].style.boxShadow = '-14px 0px 6px -6px rgba(0,0,0,0.3)'
            }

            hand[i].addEventListener('mouseover', e => {
                hand[i].style.transform = 'translateY(-40px)'
                hand[i].style.outline = '4px solid white'
            })

            hand[i].addEventListener('mouseout', e => {
                hand[i].style.transform = 'translateY(0px)'
                hand[i].style.outline = '0px solid transparent'
            })

            /*hand[i].addEventListener('click', e => {
                hand[i].style.position = 'fixed'
                hand[i].style.top = playStackRef.current.getBoundingClientRect().y + 'px'
                hand[i].style.left = playStackRef.current.getBoundingClientRect().x + 'px'
            })*/
        }
        handRef.current.style.width = ((hand.length - 1) * 80 + 180) + 'px'
    }, [])

    /*useEffect(() => {
        let opponentHandLeft = Array.from(opponentHandLeftRef.current.children)
        let difference = 0
        for(let i in opponentHandLeft) {
            opponentHandLeft[i].style.left = difference + 'px'
            difference += 40

            if(i != 0) {
                opponentHandLeft[i].style.boxShadow = '-14px 0px 6px -6px rgba(0,0,0,0.1)'
            }
        }
        opponentHandLeftRef.current.style.width = ((opponentHandLeft.length - 1) * 40 + 180) + 'px'
    }, [])

    useEffect(() => {
        let opponentHandTop = Array.from(opponentHandTopRef.current.children)
        let difference = 0
        for(let i in opponentHandTop) {
            opponentHandTop[i].style.left = difference + 'px'
            difference += 40

            if(i != 0) {
                opponentHandTop[i].style.boxShadow = '-14px 0px 6px -6px rgba(0,0,0,0.1)'
            }
        }
        opponentHandTopRef.current.style.width = ((opponentHandTop.length - 1) * 40 + 180) + 'px'
    }, [])

    useEffect(() => {
        let opponentHandRight = Array.from(opponentHandRightRef.current.children)
        let difference = 0
        for(let i in opponentHandRight) {
            opponentHandRight[i].style.left = difference + 'px'
            difference += 40

            if(i != 0) {
                opponentHandRight[i].style.boxShadow = '-14px 0px 6px -6px rgba(0,0,0,0.1)'
            }
        }
        opponentHandRightRef.current.style.width = ((opponentHandRight.length - 1) * 40 + 180) + 'px'
    }, [])*/

    return (
        <div className='table'>
            <div className='stacks'>
                <div ref={stackRef} className='stack'>
                    {stack.map(value => {
                        return <Card back={true} color='rgb(100,100,100)' />
                    })}
                </div>
                <div ref={playStackRef} className='playStack'>
                    <Card value='3' color='rgb(255, 204, 0' />
                </div>
            </div>
            <div ref={handRef} className='hand shadow'>
                <Card back={true} color='rgb(100,100,100)' />
                <Card value='7' color='rgb(127, 255, 42)'/>
                <Card value='3' color='rgb(42, 127, 255)'/>
                <Card special={true} value='swap' color='rgb(20,20,20)'/>
                <Card special={true} value='block' color='rgb(255, 42, 42)'/>
                <Card special={true} value='reverse' color='rgb(255, 204, 0'/>
                <Card hSpecial={true} value='+2' color='rgb(42, 127, 255)'/>
                <Card hSpecial={true} value='+4' color='rgb(20,20,20)'/>
            </div>
            {/*<div ref={opponentHandLeftRef} className='opponentHand opponentHandLeft shadow'>
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
            </div>
            <div ref={opponentHandTopRef} className='opponentHand opponentHandTop shadow'>
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
            </div>
            <div ref={opponentHandRightRef} className='opponentHand opponentHandRight shadow'>
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                <Card back={true} color='rgb(100,100,100)' />
                </div>*/}
        </div>
    )
}

export default GameRoom