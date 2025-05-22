// import { readFile } from 'fs/promises'
// import { join } from 'path'

// export default defineEventHandler(async (event) => {
//     try {
//         // Récupérer l'ID depuis les paramètres de route
//         const id = event.context.params.id
//         const filePath = join(process.cwd(), 'public', 'data', 'images.json')
//         const images = JSON.parse(await readFile(filePath, 'utf-8'))

//         // Trouver l'image correspondante
//         const image = images.find(img => img.id === id)

//         if (!image) {
//             return {
//                 statusCode: 404,
//                 body: { message: 'Image non trouvée' }
//             }
//         }

//         return image

//     } catch (error) {
//         console.error('Error:', error)
//         return {
//             statusCode: 500,
//             body: { message: 'Erreur serveur' }
//         }
//     }
// })

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id
        const client = await serverSupabaseClient(event)

        // Récupération d'une image spécifique par son ID
        const { data, error } = await client
            .from('images')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return {
                statusCode: error.code === 'PGRST116' ? 404 : 500,
                body: { message: error.message }
            }
        }

        return data
    } catch (error) {
        console.error('Error:', error)
        return {
            statusCode: 500,
            body: { message: 'Erreur serveur' }
        }
    }
})