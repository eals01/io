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
        socket.on('share-room-code', code => {
            socket.emit('join-room', code)
            socket.off('share-room-code')
            history.push('/lobby/createUser')
            console.log(history)
        })
    }

    // handle join game
    const handleSubmitJoinRoom = () => {
        console.log(code)
        socket.emit('join-room', code)
        history.push('/lobby/createUser')
    }

    if(connected) {
        return (
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
        )
    }
    else {
        return <span>No connection</span>
    }
}

export default FrontPage