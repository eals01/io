import { socket } from '../socket'

import { useHistory } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import './CreateUser.scss'

const CreateUser = () => {
    const history = useHistory()
    
    const [connected, setConnected] = useState(false)
    const [name, setName] = useState('')
    const [color, setColor] = useState('')
    const [roomCode, setRoomCode] = useState('')

    const canvasRef = useRef()

    // request resources
    useEffect(() => {
        socket.emit('request-create-user-page')
        socket.on('init-create-user-page', values => {
            setColor(values.color)
            setRoomCode(values.code)
            setConnected(true)

            const context = canvasRef.current.getContext('2d')
            context.beginPath()
            context.strokeStyle = values.color
            context.lineWidth = 10
            context.rect(12, 12, 225, 225)
            context.stroke()
        })
    }, [])

    const submitHandler = () => {
        socket.emit('create-user', {name: name, image: canvasRef.current.toDataURL()})
        history.push('/lobby')
    }

    if(connected) {
        return (
            <div className='createUserContainer'>
                <h4>{roomCode}</h4>
                <canvas ref={canvasRef} width='250px' height='250px' />
                <input 
                    type = 'text'
                    placeholder = 'Enter name'
                    style = {{color: color}}
                    
                    value = {name}
                    onChange = {event => setName(event.target.value.toUpperCase())}
                />
                <button onClick={submitHandler}>OK</button>
            </div>
        )
    }
    else {
        return <span>No connection to server</span>
    }
}

export default CreateUser