import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const filePath = join(process.cwd(), 'public', 'data', 'images.json')
        const images = JSON.parse(await readFile(filePath, 'utf-8'))

        const imageIndex = images.findIndex(image => image.id === body.id)
        if (imageIndex !== -1) {
            // Mise à jour des champs selon les mêmes critères que dans la version Supabase
            if ('remarque' in body) {
                images[imageIndex].remarque = body.remarque
            }
            if ('vu' in body) {
                images[imageIndex].vu = body.vu
            }

            await writeFile(filePath, JSON.stringify(images, null, 2))
            return {
                success: true,
                data: images[imageIndex]
            }
        } else {
            return { success: false, message: 'Image not found' }
        }
    } catch (error) {
        console.error('Error updating image:', error)
        return {
            success: false,
            message: 'Error updating image',
            error: error.message
        }
    }
})