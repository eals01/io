import { socket } from '../socket'

import { useHistory } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'

import Chat from '../components/Chat'
import Admin from '../components/Admin'

import './Lobby.scss'

const Lobby = () => {
    const history = useHistory()

    // join game
    useEffect(() => {
        socket.on('game-access', () => {
            history.push('/game-room')
        })
    }, [])

    //const history = useHistory()
    
    const [connected, setConnected] = useState(false)
    const [lobbyCode, setLobbyCode] = useState('')
    const [users, setUsers] = useState([])
    const [admin, setAdmin] = useState(false)

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
            console.log(users)
            setUsers(users)
            if(users.find(user => {return user.isAdmin === true}).id === socket.id) {
                setAdmin(true)
            }
        })
    }, [])

    // update usercircle positions and colors
    useEffect(() => {
        if(circleRef.current !== undefined) {
            let userList = Array.from(circleRef.current.children)
            let corners = userList.length
            let degrees = 360 / corners
            let radius = 200

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
                                <div>
                                    <img src={user.image} alt='user' />
                                    <span>{user.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='center'>
                    <Chat />
                    {admin ? (
                        <Admin />
                    ) : (
                        <React.Fragment />
                    )}
                </div>
            </React.Fragment>
        :
            <span>No connection</span>
    ]
}


export default Lobby