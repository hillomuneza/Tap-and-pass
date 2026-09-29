import { useEffect, useRef, useState, useCallback } from 'react'

export function useCardReader() {
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const ws = new WebSocket('ws://localhost:4002')
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      console.log('Card reader WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        setLastEvent(message)
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      console.log('Card reader WebSocket disconnected')
      setTimeout(connect, 3000)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      setConnected(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setConnected(false)
    }
  }, [])

  const sendCardDetected = useCallback((cardId, deviceId = 'DEV-003') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'card_detected',
        payload: { card_id: cardId, device_id: deviceId }
      }))
    }
  }, [])

  const sendAllow = useCallback((crossingId, deviceId = 'DEV-003') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'allow',
        payload: { crossing_id: crossingId, device_id: deviceId }
      }))
    }
  }, [])

  const sendDeny = useCallback((crossingId, deviceId = 'DEV-003', reason) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'deny',
        payload: { crossing_id: crossingId, device_id: deviceId, reason }
      }))
    }
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return {
    connected,
    lastEvent,
    sendCardDetected,
    sendAllow,
    sendDeny,
    connect,
    disconnect
  }
}
