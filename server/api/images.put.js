// import { readFile, writeFile } from 'fs/promises'
// import { join } from 'path'

// export default defineEventHandler(async (event) => {
//     const body = await readBody(event)
//     const filePath = join(process.cwd(), 'public', 'data', 'images.json')
//     const images = JSON.parse(await readFile(filePath, 'utf-8'))

//     const imageIndex = images.findIndex(image => image.id === body.id)
//     if (imageIndex !== -1) {
//         images[imageIndex].remarque = body.remarque
//         await writeFile(filePath, JSON.stringify(images, null, 2))
//         return { success: true }
//     } else {
//         return { success: false, message: 'Image not found' }
//     }
// })

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const client = await serverSupabaseClient(event)

        // Préparation des champs à mettre à jour
        const updateFields = {}

        // Mise à jour de la remarque si elle est fournie
        if ('remarque' in body) {
            updateFields.remarque = body.remarque
        }

        // Mise à jour du statut "vu" si fourni
        if ('vu' in body) {
            updateFields.vu = body.vu
        }

        console.log('Champs à mettre à jour:', updateFields)

        // Mise à jour dans la base de données
        const { data, error } = await client
            .from('images')
            .update(updateFields)
            .eq('id', body.id)
            .select()

        if (error) {
            return {
                success: false,
                message: error.message
            }
        }

        return {
            success: true,
            data
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