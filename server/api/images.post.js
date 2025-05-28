import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event)

        if (!formData || !formData[0]) {
            return {
                success: false,
                message: 'Aucun fichier reçu'
            }
        }

        const file = formData[0]
        const fileExt = file.filename.split('.').pop()
        const fileName = `IMG_${Date.now()}.${fileExt}`
        const uniqueId = `img-${randomUUID()}`

        // Chemin pour enregistrer l'image
        const filePath = join(process.cwd(), 'public', 'images', fileName)

        // Sauvegarder le fichier
        await writeFile(filePath, file.data)

        // Ajouter l'entrée dans le JSON
        const jsonPath = join(process.cwd(), 'public', 'data', 'images.json')
        const images = JSON.parse(await readFile(jsonPath, 'utf-8'))

        // Créer une nouvelle image avec timestamps
        const now = new Date().toISOString()
        const newImage = {
            id: uniqueId,
            url: `/api/images/file/${fileName}`,
            remarque: '',
            filename: fileName,
            vu: false,
            created_at: now,
            updated_at: now
        }

        images.push(newImage)
        await writeFile(jsonPath, JSON.stringify(images, null, 2))

        return {
            success: true,
            image: newImage
        }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            message: "Erreur lors de l'upload",
            error: error.message
        }
    }
})