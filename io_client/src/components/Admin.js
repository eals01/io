import { socket } from '../socket'

import { useHistory } from 'react-router-dom'

import './Admin.scss'

const Admin = () => {
    const history = useHistory()

    const handleStart = () => {
        socket.emit('start-game')
    }

    return (
        <button className='startButton' onClick={handleStart}>Start</button>
    )
}

export default Admin