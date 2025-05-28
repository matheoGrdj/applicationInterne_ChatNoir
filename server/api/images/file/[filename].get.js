import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    try {
        const filename = event.context.params.filename
        const imagePath = join(process.cwd(), 'public', 'images', filename)

        if (!existsSync(imagePath)) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Image not found'
            })
        }

        const imageBuffer = await readFile(imagePath)

        // Déterminer le type MIME basé sur l'extension
        const ext = filename.split('.').pop().toLowerCase()
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif'
        }

        const contentType = mimeTypes[ext] || 'image/jpeg'

        setHeader(event, 'Content-Type', contentType)
        setHeader(event, 'Cache-Control', 'no-cache')

        return imageBuffer
    } catch (error) {
        console.error('Error serving image:', error)
        throw createError({
            statusCode: 404,
            statusMessage: 'Image not found'
        })
    }
})