// import { writeFile, readFile } from 'fs/promises'
// import { join } from 'path'

// export default defineEventHandler(async (event) => {
//     try {

//         const formData = await readMultipartFormData(event)

//         const file = formData[0]
//             const fileName = `IMG_${Date.now()}.${file.filename.split('.').pop()}`
//             const filePath = join(process.cwd(), 'public', 'images', fileName)

//             // Sauvegarder le fichier
//             await writeFile(filePath, file.data)

//             // Ajouter l'entrée dans le JSON
//             const jsonPath = join(process.cwd(), 'public', 'data', 'images.json')
//             const images = JSON.parse(await readFile(jsonPath, 'utf-8'))
//             const newImage = {
//                 id: `img-${Date.now()}`,
//                 url: `/images/${fileName}`,
//                 remarque: '',
//             }
//             images.push(newImage)
//             await writeFile(jsonPath, JSON.stringify(images, null, 2))

//             return {
//                 success: true,
//                 image: newImage
//             }
//         } catch (error) {
//             console.error('Upload error:', error)
//             return {
//                 success: false,
//                 message: "Erreur lors de l'upload"

//             }
//         }
//     })


import { serverSupabaseClient } from '#supabase/server'
import { randomUUID } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    // try {
    const client = await serverSupabaseClient(event)
    const formData = await readMultipartFormData(event)

    if (!formData || !formData[0]) {
        return {
            success: false,
            message: 'Aucun fichier reçu'
        }
    }

    const file = formData[0]
    const fileExt = file.filename.split('.').pop()
    const fileName = `IMG_${Date.now()}.${fileExt}`
    const uniqueId = `img-${randomUUID()}`

    // // Chemin pour enregistrer l'image localement
    // const filePath = join(process.cwd(), 'public', 'images', fileName)

    // // Création de l'URL relative pour le stockage en BDD
    // const imageUrl = `/images/${fileName}`

    // try {
    // Sauvegarde du fichier localement dans le dossier public/images
    // await writeFile(filePath, file.data)
    // console.log('Image sauvegardée localement:', filePath)

    // Upload du fichier au storage Supabase
    const { data: storageData, error: storageError } = await client
        .storage
        .from('images')  // Le nom du bucket que vous avez créé dans Supabase
        .upload(`public/${fileName}`, file.data, {
            contentType: file.type,
            cacheControl: '3600'
        })



    if (storageError) {
        console.error('Erreur lors de l\'upload vers Supabase Storage:', storageError)
        throw storageError
    }

    // Récupérer l'URL publique de l'image
    const { data: urlData } = await client
        .storage
        .from('images')
        // pendant 3 ans
        .createSignedUrl('public/' + fileName, 60 * 60 * 24 * 365 * 3)

    const imageUrl = urlData.signedUrl

    // Ajout de l'entrée dans la base de données Supabase
    const { data: imageData, error: dbError } = await client
        .from('images')
        .insert({
            id: uniqueId,
            url: imageUrl,  // URL locale
            remarque: '',
            filename: fileName,
            vu: false
        })
        .select()
        .single()

    if (dbError) {
        throw dbError
    }

    return {
        success: true,
        image: imageData
    }
    //     } catch (uploadError) {
    //         console.error('Erreur lors de l\'upload:', uploadError)
    //         throw new Error('Erreur lors de la sauvegarde de l\'image')
    //     }
    // } catch (error) {
    //     console.error('Upload error:', error)
    //     return {
    //         success: false,
    //         message: "Erreur lors de l'upload",
    //         error: error.message
    //     }
    // }
})