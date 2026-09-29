import { useState, useEffect, useCallback } from 'react'

const PENDING_ACTIONS_KEY = 'tap_pending_actions'
const TRAVELERS_CACHE_KEY = 'tap_travelers_cache'

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingActions, setPendingActions] = useState(() => {
    try {
      const stored = localStorage.getItem(PENDING_ACTIONS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const cacheTravelers = useCallback((travelers) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: travelers
      }
      localStorage.setItem(TRAVELERS_CACHE_KEY, JSON.stringify(cacheData))
    } catch (err) {
      console.error('Failed to cache travelers:', err)
    }
  }, [])

  const getCachedTravelers = useCallback(() => {
    try {
      const stored = localStorage.getItem(TRAVELERS_CACHE_KEY)
      if (stored) {
        const cacheData = JSON.parse(stored)
        const age = Date.now() - cacheData.timestamp
        if (age < 24 * 60 * 60 * 1000) {
          return cacheData.data
        }
      }
    } catch {
      return null
    }
    return null
  }, [])

  const queueAction = useCallback((action) => {
    const item = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...action
    }
    setPendingActions(prev => {
      const updated = [...prev, item]
      localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(updated))
      return updated
    })
    return item
  }, [])

  const syncPendingActions = useCallback(async (api) => {
    const pending = [...pendingActions]
    const results = []

    for (const action of pending) {
      try {
        let result
        switch (action.type) {
          case 'approve':
            result = await api.approveCrossing(action.crossingId, action.reason)
            break
          case 'deny':
            result = await api.denyCrossing(action.crossingId, action.reason)
            break
          case 'card_detected':
            result = await api.cardDetected(action.payload)
            break
        }
        results.push({ id: action.id, success: true, result })
      } catch (err) {
        results.push({ id: action.id, success: false, error: err.message })
      }
    }

    setPendingActions(prev => {
      const remaining = prev.filter(a => !results.some(r => r.id === a.id && r.success))
      localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(remaining))
      return remaining
    })

    return results
  }, [pendingActions])

  const clearPendingActions = useCallback(() => {
    setPendingActions([])
    localStorage.removeItem(PENDING_ACTIONS_KEY)
  }, [])

  return {
    isOnline,
    pendingActions,
    queueAction,
    syncPendingActions,
    clearPendingActions,
    cacheTravelers,
    getCachedTravelers
  }
}
