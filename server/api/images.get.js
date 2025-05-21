import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  // Utiliser le chemin absolu pour accéder au fichier
  const filePath = join(process.cwd(), 'data', 'images.json')
  const data = await readFile(filePath, 'utf-8')
  return JSON.parse(data)
})