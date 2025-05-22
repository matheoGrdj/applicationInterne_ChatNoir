import { serverSupabaseClient } from '#supabase/server'
import { randomUUID } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    try {
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

        // Chemin pour enregistrer l'image localement
        const filePath = join(process.cwd(), 'public', 'images', fileName)

        // Création de l'URL relative pour le stockage en BDD
        const imageUrl = `/images/${fileName}`

        try {
            // Sauvegarde du fichier localement dans le dossier public/images
            await writeFile(filePath, file.data)
            console.log('Image sauvegardée localement:', filePath)

            // Ajout de l'entrée dans la base de données Supabase
            const { data: imageData, error: dbError } = await client
                .from('images')
                .insert({
                    id: uniqueId,
                    url: imageUrl,  // URL locale
                    remarque: '',
                    filename: fileName
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
        } catch (uploadError) {
            console.error('Erreur lors de la sauvegarde locale:', uploadError)
            throw new Error('Erreur lors de la sauvegarde de l\'image localement')
        }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            message: "Erreur lors de l'upload",
            error: error.message
        }
    }
})