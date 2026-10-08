import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || join(process.cwd(), 'serviceAccountKey.json')

try {
  const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf-8'))
  initializeApp({ credential: cert(serviceAccount) })
} catch {
  initializeApp()
}

const db = getFirestore()

const dataFiles = {
  users: 'server/data/users.json',
  travelers: 'server/data/travelers.json',
  crossings: 'server/data/crossings.json',
  checkpoints: 'server/data/checkpoints.json',
  devices: 'server/data/devices.json',
  alerts: 'server/data/alerts.json',
  audit_logs: 'server/data/audit_logs.json',
  roles: 'server/data/roles.json',
  departments: 'server/data/departments.json',
  settings: 'server/data/settings.json'
}

async function migrateCollection(collectionName, filePath) {
  try {
    const content = await readFile(filePath, 'utf-8')
    const data = JSON.parse(content)
    const items = Array.isArray(data) ? data : [data]

    const batch = db.batch()
    items.forEach(item => {
      const docRef = db.collection(collectionName).doc(String(item.id))
      batch.set(docRef, item)
    })

    await batch.commit()
    console.log(`Migrated ${items.length} documents to ${collectionName}`)
  } catch (error) {
    console.error(`Failed to migrate ${collectionName}:`, error.message)
  }
}

async function migrate() {
  console.log('Starting Firestore migration...')

  for (const [collection, filePath] of Object.entries(dataFiles)) {
    await migrateCollection(collection, filePath)
  }

  console.log('Migration completed')
}

migrate().catch(error => {
  console.error('Migration failed:', error)
  process.exit(1)
})
