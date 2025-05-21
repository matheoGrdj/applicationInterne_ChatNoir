import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    try {
        // Récupérer l'ID depuis les paramètres de route
        const id = event.context.params.id
        const filePath = join(process.cwd(), 'server', 'data', 'images.json')
        const images = JSON.parse(await readFile(filePath, 'utf-8'))

        // Trouver l'image correspondante
        const image = images.find(img => img.id === id)

        if (!image) {
            return {
                statusCode: 404,
                body: { message: 'Image non trouvée' }
            }
        }

        return image

    } catch (error) {
        console.error('Error:', error)
        return {
            statusCode: 500,
            body: { message: 'Erreur serveur' }
        }
    }
})