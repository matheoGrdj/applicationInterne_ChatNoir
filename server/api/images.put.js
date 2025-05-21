import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const filePath = join(process.cwd(), 'server', 'data', 'images.json')
    const images = JSON.parse(await readFile(filePath, 'utf-8'))

    const imageIndex = images.findIndex(image => image.id === body.id)
    if (imageIndex !== -1) {
        images[imageIndex].remarque = body.remarque
        await writeFile(filePath, JSON.stringify(images, null, 2))
        return { success: true }
    } else {
        return { success: false, message: 'Image not found' }
    }
})