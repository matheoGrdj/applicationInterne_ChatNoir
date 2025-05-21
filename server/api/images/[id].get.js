import { readFile } from 'fs/promises'

export default defineEventHandler(async (event) => {
    try {
        // Récupérer l'ID depuis les paramètres de route
        const id = event.context.params.id

        // Lire le fichier JSON
        const images = JSON.parse(await readFile('/data/images.json', 'utf-8'))

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