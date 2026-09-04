import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, '../../.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?(.*?)["']?\s*$/)
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1]
        break
      }
    }
  }
  if (!process.env.DATABASE_URL) {
    const dbPath = path.resolve(__dirname, '../../prisma/aresta_canvas.db')
    process.env.DATABASE_URL = `file:${dbPath}`
  }
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})
