import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const jsonFilePath = join(process.cwd(), 'server', 'data', 'images.json')
        const images = JSON.parse(await readFile(jsonFilePath, 'utf-8'))

        const imageIndex = images.findIndex(image => image.id === body.id)

        // Si l'image existe, on la supprime
        if (imageIndex !== -1) {
            const imageToDelete = images[imageIndex]

            // Supprimer l'entrée du JSON
            images.splice(imageIndex, 1)
            await writeFile(jsonFilePath, JSON.stringify(images, null, 2))

            // Supprimer le fichier image
            // L'URL est sous la forme "/images/IMG_123456.jpg"
            // On extrait le nom du fichier
            const filename = imageToDelete.url.split('/').pop()
            const imageFilePath = join(process.cwd(), 'public', 'images', filename)

            // Vérifier si le fichier existe avant de le supprimer
            if (existsSync(imageFilePath)) {
                await unlink(imageFilePath)
                console.log(`Fichier supprimé: ${imageFilePath}`)
            } else {
                console.warn(`Fichier introuvable: ${imageFilePath}`)
            }

            return { success: true }
        } else {
            return { success: false, message: 'Image not found' }
        }
    } catch (error) {
        console.error('Error deleting image:', error)
        return {
            success: false,
            message: 'Error deleting image',
            error: error.message
        }
    }
})