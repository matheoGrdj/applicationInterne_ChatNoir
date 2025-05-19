import { readFile, writeFile } from 'fs/promises'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const images = JSON.parse(await readFile('server/data/images.json', 'utf-8'))

    const imageIndex = images.findIndex(image => image.id === body.id)
    if (imageIndex !== -1) {
        images[imageIndex].remarque = body.remarque
        await writeFile('server/data/images.json', JSON.stringify(images, null, 2))
        return { success: true }
    } else {
        return { success: false, message: 'Image not found' }
    }
})