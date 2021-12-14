import io from 'socket.io-client'

export const socket = io('http://192.168.10.186:4949')
socket.on('connect', () => {
    console.log('connected')
})