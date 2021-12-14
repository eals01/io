import { socket } from '../socket'

import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './FrontPage.scss'

const FrontPage = () => {
    const history = useHistory()
    
    const [connected, setConnected] = useState(false)
    const [code, setCode] = useState('')

    // request resources
    useEffect(() => {
        socket.emit('request-front-page')
        socket.on('init-front-page', () => {
            setConnected(true)
        })
    }, [])

    // handle create game
    const handleSubmitCreateRoom = () => {
        socket.emit('create-room')
        socket.emit('join-room', 'ADM0')
        history.push('/lobby/createUser')
    }

    // handle join game
    const handleSubmitJoinRoom = () => {
        if(code.length === 3) {
            socket.emit('join-room', code) 
            socket.on('allow-access-room', () => {
                history.push('/lobby/createUser')
            })
        }
    }

    return [
        connected ?
            <div className='frontPageUiContainer'>
                <h1>IO</h1>
                <button onClick={handleSubmitCreateRoom}>Create game</button>
                <span>or</span>
                <input 
                    type = 'text'
                    placeholder = 'Enter room code' 
                    maxLength = '3'
                        
                    value = {code}
                    onChange = {event => setCode(event.target.value.toUpperCase())}
                />
                <button onClick={handleSubmitJoinRoom}>Join game</button>
            </div>
        :
            <span>No connection</span>
    ]

}

export default FrontPage