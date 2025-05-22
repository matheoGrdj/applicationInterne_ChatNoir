import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    // Utiliser un chemin relatif pour accéder au fichier
    const filePath = join(process.cwd(), 'public', 'data', 'images.json')
    console.log('Chemin du fichier :', filePath)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier :', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la lecture du fichier',
    })
  }
})