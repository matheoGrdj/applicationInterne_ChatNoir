import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'images.json')
    console.log('Chemin du fichier :', filePath)

    // Vérifier si le fichier existe
    if (!existsSync(filePath)) {
      console.log('Fichier images.json non trouvé, retour d\'un tableau vide')
      return []
    }

    const data = await readFile(filePath, 'utf-8')
    const images = JSON.parse(data)

    // S'assurer que c'est un tableau
    return Array.isArray(images) ? images : []

  } catch (error) {
    console.error('Erreur lors de la lecture du fichier :', error)
    // Retourner un tableau vide en cas d'erreur au lieu de lever une exception
    return []
  }
})