const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const server = app.listen('4949', () => {
    console.log('listening on 4949')
})

const io = socket(server, {
    cors: {origin: '*'}
})

let ROOMS = []

function createLobbyCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 3; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    if(!(ROOMS.find(obj => {return obj.code === result}) === undefined)) {
        createLobbyCode()
    }
    return result
}

io.on('connection', socket => {
    console.log(socket.id.substring(0,3) + ' koblet til')

    socket.on('request-front-page', () => {
        io.to(socket.id).emit('init-front-page')
    })

    socket.on('create-room', () => {   
        let COLORS = ['#ff355e', '#ff9966', '#ffcc33', '#ccff00', '#aaf0d1', '#50bfe6', '#ff6eff'/*, '#fbffff'*/]
        for(let i = COLORS.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = COLORS[i]
            COLORS[i] = COLORS[j]
            COLORS[j] = temp
        }
        const CODE = createLobbyCode()
        ROOMS.push({code: CODE, adminID: socket.id, users: [], chat: [], colors: COLORS})

        io.to(socket.id).emit('share-room-code', CODE)
        console.log(socket.id.substring(0,3) + ' lagde rom: ' + CODE)
    })

    socket.on('join-room', code => {
        if(ROOMS.find(room => {return room.code === code}) !== undefined) {
            console.log(socket.id.substring(0,3) + ' ble med i rom: ' + code)

            io.to(socket.id).emit('allow-access-room')
            socket.join(code)
            const lobby = ROOMS.find(obj => {
                return obj.code === code
            })

            socket.on('request-create-user-page', () => {
                const COLOR = lobby.colors.pop()
                io.to(socket.id).emit('init-create-user-page', {color: COLOR, code: lobby.code})
                
                socket.on('create-user', user => {
                    let isAdmin = false
                    lobby.adminID == socket.id ? isAdmin = true : isAdmin = false
                    lobby.users.push({id: socket.id, admin: isAdmin, name: user.name, image: user.image, color: COLOR})
                    io.to(lobby.code).emit('update-users', lobby.users)
                    lobby.chat.push({name: '£ADMIN', message: `${user.name} joined!`, color: ''})
                    io.to(lobby.code).emit('update-chat', lobby.chat)
    
                    socket.on('send-chat', chat => {
                        lobby.chat.push({name: user.name, message: chat, color: COLOR})
                        io.to(lobby.code).emit('update-chat', lobby.chat)
                    })
                })
            }) 
    
            socket.on('request-lobby-page', () => {
                io.to(socket.id).emit('init-lobby-page', lobby)
                io.to(socket.id).emit('update-chat', lobby.chat)
            })
    
            function leave() {
                console.log(socket.id.substring(0,3) + ' koblet fra')
    
                const user = lobby.users.find(user => {return user.id === socket.id})
                lobby.chat.push({name: '£ADMIN', message: `${user.name} left...`, color: ''})
                io.to(lobby.code).emit('update-chat', lobby.chat)
                    
                lobby.users = lobby.users.filter(user => {
                    return user.id !== socket.id
                })
    
                if(socket.id === lobby.adminID && lobby.users.length !== 0) {
                    lobby.users[0].admin = true
                }
    
                io.to(lobby.code).emit('update-users', lobby.users)
            }
    
            socket.on('disconnect', () => {
                leave()
            })
        }
    })
})