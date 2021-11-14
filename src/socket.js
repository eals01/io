import io from 'socket.io-client'

export const socket = io('http://10.14.48.38:4949')
socket.on('connect', () => {
    console.log('connected')
})