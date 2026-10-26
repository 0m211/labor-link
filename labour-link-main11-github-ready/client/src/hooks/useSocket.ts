import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socket) {
      socket = io('${API_URL}', {
        reconnection: true,
        reconnectionAttempts: 5
      })
    }
    socketRef.current = socket

    return () => {
      // Don't disconnect on unmount — keep connection alive
    }
  }, [])

  return socketRef.current
}

export const getSocket = () => {
  if (!socket) {
    socket = io('${API_URL}', {
      reconnection: true,
      reconnectionAttempts: 5
    })
  }
  return socket
}