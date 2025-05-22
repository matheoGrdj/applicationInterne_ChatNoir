// import { readFile } from 'fs/promises'
// import { join } from 'path'

// export default defineEventHandler(async () => {
//   try {
//     // Utiliser un chemin relatif pour accéder au fichier
//     const filePath = join(__dirname, 'public', 'data', 'images.json')
//     console.log('Chemin du fichier :', filePath)
//     const data = await readFile(filePath, 'utf-8')
//     return JSON.parse(data)
//   } catch (error) {
//     console.error('Erreur lors de la lecture du fichier :', filePath, error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Erreur lors de la lecture du fichier',
//     })
//   }
// })

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // Récupération des images depuis la table 'images' de Supabase
    const { data, error } = await client
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) { throw error }

    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des images',
    })
  }
})