import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

export function useQueue() {
  const [queues, setQueues] = useState([
    { id: 1, name: 'North Gate 01', waiting: 14, estimatedWait: 8, status: 'OPEN' },
    { id: 2, name: 'North Gate 02', waiting: 3, estimatedWait: 2, status: 'OPEN' },
    { id: 3, name: 'North Gate 03', waiting: 6, estimatedWait: 4, status: 'OPEN' },
    { id: 4, name: 'South Gate 01', waiting: 9, estimatedWait: 6, status: 'OPEN' }
  ])

  const updateQueue = useCallback((checkpointId, waiting) => {
    setQueues(prev => prev.map(q =>
      q.id === checkpointId
        ? { ...q, waiting, estimatedWait: Math.max(1, Math.round(waiting * 0.6)) }
        : q
    ))
  }, [])

  const refreshQueues = useCallback(async () => {
    try {
      const res = await api.getCrossings({ status: 'pending' })
      const pending = res.data || []
      const counts = {}
      pending.forEach(c => {
        const id = c.checkpoint_id || 1
        counts[id] = (counts[id] || 0) + 1
      })
      setQueues(prev => prev.map(q => ({
        ...q,
        waiting: counts[q.id] || Math.floor(Math.random() * 10),
        estimatedWait: Math.max(1, Math.round((counts[q.id] || 0) * 0.6))
      })))
    } catch (err) {
      console.error('Failed to refresh queues:', err)
    }
  }, [])

  useEffect(() => {
    refreshQueues()
    const interval = setInterval(refreshQueues, 30000)
    return () => clearInterval(interval)
  }, [refreshQueues])

  return { queues, refreshQueues, updateQueue }
}
