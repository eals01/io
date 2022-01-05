import { socket } from '../socket'

import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Canvas from '../components/Canvas'

import './CreateUser.scss'

const CreateUser = () => {
    const history = useHistory()
    
    const [connected, setConnected] = useState(false)
    const [name, setName] = useState('')
    const [image, setImage] = useState(null)
    const [color, setColor] = useState('')
    const [roomCode, setRoomCode] = useState('')

    // request resources
    useEffect(() => {
        socket.emit('request-create-user-page')
        socket.on('init-create-user-page', values => {
            setColor(values.color)
            setRoomCode(values.code)
            setConnected(true)
        })
    }, [])

    const submitHandler = () => {
        socket.emit('create-user', {name: name, image: image})
        console.log(image)
        history.push('/lobby')
    }

    return [
        connected ?
            <div className='createUserContainer'>
                <h4>{roomCode}</h4>
                <Canvas setimage={setImage} color={color}/>
                <input 
                    type = 'text'
                    placeholder = 'Enter name'
                    style = {{color: color}}
                    
                    value = {name}
                    onChange = {event => setName(event.target.value.toUpperCase())}
                />
                <button onClick={submitHandler}>OK</button>
            </div>
        :
        <span>No connection to server</span>
    ]
}

export default CreateUser