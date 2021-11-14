import { socket } from '../socket'

import { useHistory } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'

import Chat from '../components/Chat'

import './Lobby.scss'

const Lobby = () => {
    const history = useHistory()
    
    const [connected, setConnected] = useState(false)
    const [lobbyCode, setLobbyCode] = useState('')
    const [users, setUsers] = useState([])

    const circleRef = useRef()

    // request resources
    useEffect(() => {
        socket.emit('request-lobby-page')
        socket.on('init-lobby-page', lobby => {
            setConnected(true)
            setLobbyCode(lobby.code)
            setUsers(lobby.users)
        })

        socket.on('update-users', users => {
            setUsers(users)
        })
    }, [])

    // update usercircle positions and colors
    useEffect(() => {
        if(circleRef.current !== undefined) {
            let userList = Array.from(circleRef.current.children)
            let corners = userList.length
            let degrees = 360 / corners
            let radius = 250

            let currentDegree = 0
            for(let i in userList) {
                userList[i].style.transform = `translate(
                    ${Math.floor(Math.cos(currentDegree * (Math.PI / 180)) * radius) - (userList[i].offsetWidth / 2) + 'px'}, 
                    ${Math.floor(Math.sin(currentDegree * (Math.PI / 180)) * radius) - (userList[i].offsetHeight / 2)+ 'px'}
                )`
                currentDegree += degrees

                userList[i].style.color = users[i].color
            }
        }
    }, [users])

    return [
        connected ?
            <React.Fragment>
                <div className='userCircleContainer'>
                    <span className='lobbyCode'>{lobbyCode}</span>
                    <div ref={circleRef} className='userCircle'>
                        {users.map(user => {
                            return (
                                //
                                // lag et key system
                                //
                                <div key={String(Math.random())}>
                                    <img src={user.image} alt='user' />
                                    <span>{user.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='center'>
                    <Chat />
                </div>
            </React.Fragment>
        :
            <span>No connection</span>
    ]
}


export default Lobby