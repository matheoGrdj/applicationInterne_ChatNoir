import { serverSupabaseClient } from '#supabase/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const client = await serverSupabaseClient(event)

        // Récupération des informations de l'image pour obtenir le nom du fichier
        const { data: imageData, error: getError } = await client
            .from('images')
            .select('filename')
            .eq('id', body.id)
            .single()

        if (getError) {
            return {
                success: false,
                message: 'Image not found'
            }
        }

        // Suppression du fichier local
        // if (imageData.filename) {
        //     const imageFilePath = join(process.cwd(), 'public', 'images', imageData.filename)

        //     // Vérifier si le fichier existe avant de le supprimer
        //     if (existsSync(imageFilePath)) {
        //         await unlink(imageFilePath)
        //         console.log(`Fichier supprimé: ${imageFilePath}`)
        //     } else {
        //         console.warn(`Fichier introuvable: ${imageFilePath}`)
        //     }
        // }

        if (imageData.filename) {
            const { error: deleteStorageError } = await client
                .storage
                .from('images')
                .remove([`public/${imageData.filename}`])

            if (deleteStorageError) {
                console.warn(`Erreur lors de la suppression du fichier:`, deleteStorageError)
            }
        }

        // Suppression de l'entrée de la base de données
        const { error: deleteError } = await client
            .from('images')
            .delete()
            .eq('id', body.id)

        if (deleteError) {
            return {
                success: false,
                message: deleteError.message
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error deleting image:', error)
        return {
            success: false,
            message: 'Error deleting image',
            error: error.message
        }
    }
})