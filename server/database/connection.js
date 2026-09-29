import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL || 'postgresql://tap:tap@localhost:5432/tapandpass'

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

let initialized = false

async function runMigrations() {
  if (initialized) return
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const migrationPath = join(__dirname, '..', 'migrations', '001_initial_schema.sql')
  const sql = readFileSync(migrationPath, 'utf8')
  await pool.query(sql)
  initialized = true
  console.log('Database migrations applied')
}

async function query(text, params) {
  if (!initialized) await runMigrations()
  return pool.query(text, params)
}

async function getClient() {
  if (!initialized) await runMigrations()
  return pool.connect()
}

export default { query, getClient, pool }
