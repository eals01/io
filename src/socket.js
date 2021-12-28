import io from 'socket.io-client'

export const socket = io('http://192.168.0.36:4949')
socket.on('connect', () => {
    console.log('connected')
})