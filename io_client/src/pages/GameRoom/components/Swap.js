import { socket } from '../../../socket'

import { useEffect, useRef } from 'react'

import './Swap.scss'

const Swap = props => {
    const swapContainerRef = useRef()

    useEffect(() => {
        socket.on('request-color', () => {
            swapContainerRef.current.style.display = 'flex' 
        })
    }, [])

    // handle color pick
    function handleColorSwapYellow() {
        swapContainerRef.current.style.display = 'none' 
        socket.emit('color-swap', 'Y')
    }

    function handleColorSwapBlue() {
        swapContainerRef.current.style.display = 'none' 
        socket.emit('color-swap', 'B')
    }

    function handleColorSwapRed() {
        swapContainerRef.current.style.display = 'none' 
        socket.emit('color-swap', 'R')
    }

    function handleColorSwapGreen() {
        swapContainerRef.current.style.display = 'none' 
        socket.emit('color-swap', 'G')
    }

    return (
        <div ref={swapContainerRef} className='swapContainer'>
            <div className='swapContainerBackground' />
            <div onClick={handleColorSwapYellow} className='swap yellow' />
            <div onClick={handleColorSwapBlue} className='swap blue' />
            <div onClick={handleColorSwapRed} className='swap red' />
            <div onClick={handleColorSwapGreen} className='swap green' />
        </div>
    )
}

export default Swap