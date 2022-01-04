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

function createLobbyCode() {
    const alphabet = 'ACDEFGHJKLMNPQRSTUVWXYZ2345679'
    let result = ''
    for (let i = 0; i < 3; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    if(!(ROOMS.find(obj => {return obj.code === result}) === undefined)) {
        createLobbyCode()
    }
    return result
}

let ROOMS = []
io.on('connection', socket => {
    console.log(socket.id.substring(0,3) + ' koblet til')

    let room = undefined
    let user = {id: socket.id, isAdmin: false, name: '', image: null, color: ''}

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
        ROOMS.push({code: CODE, adminID: socket.id, users: [], chat: [], colors: COLORS, gameState: {}})

        room = ROOMS.find(room => {
            return room.code === CODE
        })

        user.color = room.colors.pop()
        user.isAdmin = true

        io.to(socket.id).emit('share-room-code', CODE)
    })

    socket.on('join-room', code => {
        if(ROOMS.find(room => {return room.code === code}) !== undefined) {
            console.log(socket.id.substring(0,3) + ' ble med i rom: ' + code)

            room = ROOMS.find(room => {return room.code === code})

            socket.join(code)
            user.color = room.colors.pop()
            room.users.push(user)

            io.to(socket.id).emit('allow-access-room')
        }
        else if(code === 'ADM0') {
            console.log(socket.id.substring(0,3) + ' lagde og ble med i rom: ' + room.code)

            socket.join(room.code)
            room.users.push(user)
        }
    })

    socket.on('request-create-user-page', () => {
        const user = room.users.find(user => {
            return user.id === socket.id
        })

        io.to(socket.id).emit('init-create-user-page', {color: user.color, code: room.code})
    })

    socket.on('create-user', values => {
        const user = room.users.find(user => {
            return user.id === socket.id
        })

        user.name = values.name
        user.image = values.image

        room.chat.push({name: '£ADMIN', message: `${user.name} joined!`, color: ''})
        io.to(room.code).emit('update-chat', room.chat)
    })

    socket.on('request-lobby-page', () => {
        io.to(socket.id).emit('init-lobby-page', {code: room.code, users: room.users})
        io.to(room.code).emit('update-users', room.users)
        io.to(room.code).emit('update-chat', room.chat)
    })

    socket.on('send-chat', message => {
        const user = room.users.find(user => {
            return user.id === socket.id
        })

        room.chat.push({name: user.name, message: message, color: user.color})
        io.to(room.code).emit('update-chat', room.chat)
    })

    socket.on('disconnect', () => {
        console.log(socket.id.substring(0,3) + ' koblet fra')

        if(room !== undefined) {
            if(room.users.find(user => {return user.id === socket.id}).isAdmin && room.users.length > 1) {
                room.users[1].isAdmin = true
            }
            room.users = room.users.filter(user => {return user.id !== socket.id})
            io.to(room.code).emit('update-users', room.users)

            room.chat.push({name: '£ADMIN', message: `${user.name} left...`, color: ''})
            io.to(room.code).emit('update-chat', room.chat)
        }
    })

    socket.on('start-game', () => {
        createGame(room)
    })

    socket.on('request-game-room', () => {
        io.to(room.code).emit('update-chat', room.chat)

        let i = Array.from(io.sockets.adapter.rooms.get(room.code)).indexOf(socket.id)
        let hand = room.gameState.hands.slice()[i]
        let opponentHands = room.gameState.hands.slice()
        opponentHands.splice(i, 1)

        for(let i in opponentHands) {
            opponentHands[i] = opponentHands[i].length 
        }

        io.to(socket.id).emit('update-game', {
            hand: hand,
            opponentHands: opponentHands,
            playStack: room.gameState.playStack,
            drawStack: room.gameState.drawStack.length
        })
    })

    socket.on('play-card', card => {
        let i = Array.from(io.sockets.adapter.rooms.get(room.code)).indexOf(socket.id)
        let hand = room.gameState.hands.slice()[i]
        if(room.gameState.turn === i) {
            if(hand[card][0] == room.gameState.playStack[room.gameState.playStack.length - 1][0] 
            || hand[card][1] == room.gameState.playStack[room.gameState.playStack.length - 1][1]) {
                let playedCard = hand.splice(card, 1)[0]
                room.gameState.playStack.push(playedCard)
                room.gameState.turn < room.gameState.playerAmount - 1 ? room.gameState.turn++ : room.gameState.turn = 0
            } else if(hand[card][0] === 'X') {
                hand.splice(card, 1)[0]
                io.to(socket.id).emit('request-color')
                room.gameState.turn < room.gameState.playerAmount - 1 ? room.gameState.turn++ : room.gameState.turn = 0
            }

            // update game individually
            for(let j = 0; j < Array.from(io.sockets.adapter.rooms.get(room.code)).length; j++) {
                let socketid = Array.from(io.sockets.adapter.rooms.get(room.code))[j]

                let hand = room.gameState.hands.slice()[j]

                let opponentHands = room.gameState.hands.slice()
                opponentHands[j] = 'you'
                for(let i in opponentHands) {
                    if(opponentHands[i] != 'you') {
                        opponentHands[i] = opponentHands[i].length 
                    }
                }
                while(opponentHands[0] != 'you') {
                    opponentHands.push(opponentHands.shift())
                }

                opponentHands.shift()

                io.to(socketid).emit('update-game', {
                    hand: hand,
                    opponentHands: opponentHands,
                    playStack: room.gameState.playStack,
                    drawStack: room.gameState.drawStack.length
                })
            }
        }
    })

    socket.on('request-card', () => {
        let i = Array.from(io.sockets.adapter.rooms.get(room.code)).indexOf(socket.id)
        room.gameState.hands[i].push(draw(room.gameState.drawStack))

        // update game individually
        for(let j = 0; j < Array.from(io.sockets.adapter.rooms.get(room.code)).length; j++) {
            let socketid = Array.from(io.sockets.adapter.rooms.get(room.code))[j]

            let hand = room.gameState.hands.slice()[j]

            let opponentHands = room.gameState.hands.slice()
            opponentHands.splice(j, 1)
            for(let i in opponentHands) {
                opponentHands[i] = opponentHands[i].length 
            }

            io.to(socketid).emit('update-game', {
                hand: hand,
                opponentHands: opponentHands,
                playStack: room.gameState.playStack,
                drawStack: room.gameState.drawStack.length
            })
        }
    })

    socket.on('color-swap', color => {
        room.gameState.playStack.push(color + 'S')
        console.log(room.gameState.playStack)

        // update game individually
        for(let j = 0; j < Array.from(io.sockets.adapter.rooms.get(room.code)).length; j++) {
            let socketid = Array.from(io.sockets.adapter.rooms.get(room.code))[j]

            let hand = room.gameState.hands.slice()[j]

            let opponentHands = room.gameState.hands.slice()
            opponentHands.splice(j, 1)
            for(let i in opponentHands) {
                opponentHands[i] = opponentHands[i].length 
            }

            io.to(socketid).emit('update-game', {
                hand: hand,
                opponentHands: opponentHands,
                playStack: room.gameState.playStack,
                drawStack: room.gameState.drawStack.length
            })
        }
    })
})

// game logic
const stack = [
    'R0','R1','R1','R2','R2','R3','R3','R4','R4','R5','R5','R6','R6','R7','R7','R8','R8','R9','R9','RB','RB','RR','RR','RP2','RP2',
    'Y0','Y1','Y1','Y2','Y2','Y3','Y3','Y4','Y4','Y5','Y5','Y6','Y6','Y7','Y7','Y8','Y8','Y9','Y9','YB','YB','YR','YR','YP2','YP2',
    'G0','G1','G1','G2','G2','G3','G3','G4','G4','G5','G5','G6','G6','G7','G7','G8','G8','G9','G9','GB','GB','GR','GR','GP2','GP2',
    'B0','B1','B1','B2','B2','B3','B3','B4','B4','B5','B5','B6','B6','B7','B7','B8','B8','B9','B9','BB','BB','BR','BR','BP2','BP2',
    'XS','XS','XS','XS','XP4','XP4','XP4','XP4'
]

function createGame(room) {
    let clients = Array.from(io.sockets.adapter.rooms.get(room.code))

    let gameState = {
        turn: 0,
        hands: [[], [], [], []],
        drawStack: stack,
        playStack: [],
        playerAmount: clients.length
    }
    gameState.playStack.push(draw(gameState.drawStack))
    gameState.turn = Math.floor(Math.random() * gameState.playerAmount)

    for(let i = 0; i < 4; i++) {
        if(clients[i] == undefined) {
            clients.push('empty')
        }
    }
    
    for(let i in clients) {
        if(clients[i] != 'empty') {
            for(let j = 0; j < 8; j++) {
                gameState.hands[i].push(draw(gameState.drawStack))
            }
        }
    }

    room.gameState = gameState

    io.to(room.code).emit('game-access')
}

function draw(stack) {
    return stack.splice(Math.random() * stack.length, 1)[0]
}