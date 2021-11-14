import { socket } from '../socket'

import { useState, useEffect, useRef } from 'react'

import './Chat.scss'

const Chat = () => {
    const [chat, setChat] = useState([])
    const [chatMessage, setChatMessage] = useState('')

    const chatRef = useRef()

    useEffect(() => {
        let isInitiated = false
        socket.on('update-chat', chat => {
            console.log(chat)
            setChat(chat)
            if(Math.ceil(chatRef.current.scrollTop) + chatRef.current.clientHeight + 30 >= chatRef.current.scrollHeight) {
                chatRef.current.scrollBy(0, 30)
            }
            if(!isInitiated) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight
            }
        })
    }, [])

    const handleSubmit = event => {
        if(event.key === 'Enter') {
            if(chatMessage !== '') {
                socket.emit('send-chat', chatMessage)
                setChatMessage('')
                chatRef.current.scrollTop = chatRef.current.scrollHeight
            }
        }
    }

    return (
        <div className='chatContainer'>
            <div ref={chatRef} className='chat'>
                {chat.map(chat => {
                    return [
                        chat.name !== '£ADMIN' ?
                            <div key={String(Math.random())} className='chatMessage'>
                                <span style={{color: chat.color}}>{chat.name + ' '}</span>
                                <span>{chat.message}</span>
                            </div>
                        :
                            <div key={String(Math.random())} className='chatMessage'>
                                <span style={{color: 'rgb(200,200,200)'}}>{chat.message}</span>
                            </div>
                    ]
                })}
            </div>
            <input 
                type = 'text'
                placeholder = 'Aa'

                value = {chatMessage}
                onChange = {event => setChatMessage(event.target.value)}
                onKeyDown = {handleSubmit}
            />
        </div>
    )
}

export default Chat