import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    // Utiliser un chemin relatif pour accéder au fichier
    const filePath = join(__dirname, '..', 'data', 'images.json')
    console.log('Chemin du fichier :', filePath)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier :', filePath, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la lecture du fichier',
    })
  }
})
