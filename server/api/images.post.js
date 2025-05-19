import { writeFile, readFile } from 'fs/promises'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const images = JSON.parse(await readFile('server/data/images.json', 'utf-8'))

    images.push({ id: `img-${Date.now()}`, url: body.url, remarque: '' })
    await writeFile('server/data/images.json', JSON.stringify(images, null, 2))

    return { success: true }
})
