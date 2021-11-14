import { socket } from '../socket'

import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './CreateUser.scss'

const CreateUser = () => {
    const history = useHistory()
    const [connected, setConnected] = useState(false)
    const [name, setName] = useState('')
    const [color, setColor] = useState('')

    // request resources
    useEffect(() => {
        socket.emit('request-create-user-page')
        socket.on('init-create-user-page', color => {
            setColor(color)
            setConnected(true)
        })
    }, [])

    const submitHandler = () => {
        socket.emit('create-user', {name: name})
        //history.push('/lobby')
    }

    if(connected) {
        return (
            <div className='createUserContainer'>
            <canvas width='250px' height='250px' />
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