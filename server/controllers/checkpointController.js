import { db } from '../database/fileDb.js'

function normalizeCheckpoint(checkpoint) {
  if (!checkpoint) return checkpoint
  if (checkpoint.border_name !== undefined && checkpoint.border === undefined) {
    checkpoint = { ...checkpoint, border: checkpoint.border_name }
  }
  return checkpoint
}

export function getCheckpoints(req, res) {
  const data = db.getCheckpoints().map(normalizeCheckpoint)
  res.json({ data })
}

export function getCheckpoint(req, res) {
  const checkpoint = db.getCheckpoints().find(c => c.id === Number(req.params.id))
  if (!checkpoint) return res.status(404).json({ error: 'Checkpoint not found' })
  res.json({ data: normalizeCheckpoint(checkpoint) })
}
