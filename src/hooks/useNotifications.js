import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const STORAGE_KEY = 'tap_notifications'
const PENDING_KEY = 'tap_pending_sync'

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const saveNotifications = (itemsOrUpdater) => {
    setNotifications(prev => {
      const next = typeof itemsOrUpdater === 'function' ? itemsOrUpdater(prev) : itemsOrUpdater
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const addNotification = useCallback((notification) => {
    const item = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    saveNotifications(prev => [item, ...prev].slice(0, 100))
    return item
  }, [])

  const markAsRead = useCallback((id) => {
    saveNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllAsRead = useCallback(() => {
    saveNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    saveNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleOnline = () => {
      syncPendingNotifications()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  const syncPendingNotifications = async () => {
    try {
      const pending = localStorage.getItem(PENDING_KEY)
      if (pending) {
        const items = JSON.parse(pending)
        for (const item of items) {
          await api.getTravelers().catch(() => {})
        }
        localStorage.removeItem(PENDING_KEY)
      }
    } catch (err) {
      console.error('Failed to sync notifications:', err)
    }
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  }
}
