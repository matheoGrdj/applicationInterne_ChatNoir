import { readFile, writeFile } from 'fs/promises'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const images = JSON.parse(await readFile('server/data/images.json', 'utf-8'))

    const imageIndex = images.findIndex(image => image.id === body.id)

    // Si l'image existe, on la supprime
    if (imageIndex !== -1) {
        images.splice(imageIndex, 1)
        await writeFile('server/data/images.json', JSON.stringify(images, null, 2))
        return { success: true }
    } else {
        return { success: false, message: 'Image not found' }
    }
})