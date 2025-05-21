import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

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
        const fileName = `IMG_${Date.now()}.${file.filename.split('.').pop()}`
        const filePath = join('public', 'images', fileName)

        // Sauvegarder le fichier
        await writeFile(filePath, file.data)

        // Ajouter l'entrée dans le JSON
        const images = JSON.parse(await readFile('public/data/images.json', 'utf-8'))
        const newImage = {
            id: `img-${Date.now()}`,
            url: `/images/${fileName}`,
            remarque: ''
        }
        images.push(newImage)
        await writeFile('public/data/images.json', JSON.stringify(images, null, 2))

        return {
            success: true,
            image: newImage
        }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            message: "Erreur lors de l'upload"
        }
    }
})