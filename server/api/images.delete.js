import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const jsonPath = join(process.cwd(), 'public', 'data', 'images.json')
        const images = JSON.parse(await readFile(jsonPath, 'utf-8'))

        // Trouver l'image
        const imageIndex = images.findIndex(img => img.id === body.id)
        if (imageIndex === -1) {
            return {
                success: false,
                message: 'Image not found'
            }
        }

        const image = images[imageIndex]

        // Supprimer le fichier physique si possible
        if (image.filename) {
            const imageFilePath = join(process.cwd(), 'public', 'images', image.filename)

            // Vérifier si le fichier existe avant de le supprimer
            if (existsSync(imageFilePath)) {
                await unlink(imageFilePath)
                console.log(`Fichier supprimé: ${imageFilePath}`)
            } else {
                console.warn(`Fichier introuvable: ${imageFilePath}`)
            }
        }

        // Supprimer l'entrée du fichier JSON
        images.splice(imageIndex, 1)
        await writeFile(jsonPath, JSON.stringify(images, null, 2))

        return { success: true }
    } catch (error) {
        console.error('Error deleting image:', error)
        return {
            success: false,
            message: 'Error deleting image',
            error: error.message
        }
    }
})