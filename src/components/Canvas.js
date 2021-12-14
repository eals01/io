import { useEffect, useRef } from 'react'

import './Canvas.scss'

const Canvas = props => {
    const canvasRef = useRef()
    
    useEffect(() => {
        const context = canvasRef.current.getContext('2d')
        context.strokeStyle = 'transparent'
        context.lineWidth = 10
        context.lineCap = 'round'

        canvasRef.current.addEventListener('mousedown', () => {
            context.strokeStyle = props.color
            context.beginPath()
        })
        canvasRef.current.addEventListener('mousemove', event => {
            context.lineTo(event.x - canvasRef.current.getBoundingClientRect().left, event.y - canvasRef.current.getBoundingClientRect().top)
            context.stroke()
        })
        canvasRef.current.addEventListener('mouseup', () => {
            context.strokeStyle = 'transparent'
            context.closePath()
            props.setimage(canvasRef.current.toDataURL())
        })
    }, [props])

    return (
        <canvas ref={canvasRef} width='250px' height='250px' />
    )
}

export default Canvas