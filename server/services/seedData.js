import { ensureSeedData } from '../controllers/authController.js'

export function seedData() {
  ensureSeedData()
  console.log('Demo data seeded successfully')
}
