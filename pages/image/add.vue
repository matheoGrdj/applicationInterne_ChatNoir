<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const selectedFile = ref(null)
const isUploading = ref(false)
const error = ref(null)
const preview = ref(null)

const handleFileChange = (event) => {
    const file = event.target.files[0]
    selectedFile.value = file

    // Créer une prévisualisation de l'image
    if (file) {
        const reader = new FileReader()
        reader.onload = e => {
            preview.value = e.target.result
        }
        reader.readAsDataURL(file)
    } else {
        preview.value = null
    }
}

const uploadImage = async () => {
    if (!selectedFile.value) {
        error.value = "Veuillez sélectionner une image"
        return
    }

    isUploading.value = true
    error.value = null

    try {
        const formData = new FormData()
        formData.append('image', selectedFile.value)

        const response = await fetch('/api/images', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        if (data.success) {
            router.push('/')
        } else {
            error.value = data.message || "Erreur lors de l'upload"
        }
    } catch (err) {
        error.value = "Erreur lors de l'upload"
        console.error('Upload error:', err)
    } finally {
        isUploading.value = false
    }
}

const goBack = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4">
        <div class="container mx-auto max-w-2xl">
            <button @click="goBack"
                class="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:cursor-pointer flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
            </button>

            <div class="bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ajouter une nouvelle image</h2>

                <form @submit.prevent="uploadImage" class="space-y-6">
                    <!-- Zone de prévisualisation -->
                    <div v-if="preview" class="flex justify-center mb-4">
                        <div class="w-64 h-64 overflow-hidden rounded-lg border border-gray-300">
                            <img :src="preview" alt="Prévisualisation" class="w-full h-full object-contain" />
                        </div>
                    </div>

                    <!-- Zone de sélection du fichier -->
                    <div
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <label class="cursor-pointer flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span v-if="!preview" class="text-sm font-medium text-gray-700 mb-2">
                                Cliquez pour sélectionner une image
                            </span>
                            <span v-if="preview" class="text-sm font-medium text-gray-700 mb-2">
                                Cliquez pour changer l'image
                            </span>
                            <input type="file" accept="image/*" @change="handleFileChange" class="hidden"
                                aria-label="Sélectionner une image" />
                        </label>
                    </div>

                    <div v-if="selectedFile" class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 truncate">{{ selectedFile.name }}</span>
                        <button type="button" @click="selectedFile = null; preview = null"
                            class="text-red-500 hover:text-red-700 hover:cursor-pointer">
                            Supprimer
                        </button>
                    </div>

                    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                        <p>{{ error }}</p>
                    </div>

                    <button type="submit" :disabled="isUploading || !selectedFile"
                        class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:cursor-pointer disabled:cursor-not-allowed flex items-center justify-center">
                        <svg v-if="isUploading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-if="isUploading">Envoi en cours...</span>
                        <span v-else>Enregistrer l'image</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>