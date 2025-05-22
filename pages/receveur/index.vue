<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const images = ref([])
const loading = ref(true)
const error = ref(null)

// Récupérer toutes les images qui ont des remarques
onMounted(async () => {
    try {
        loading.value = true
        const response = await fetch('/api/images')
        const data = await response.json()

        // Filtrer pour ne garder que les images avec des remarques
        images.value = data.filter(img => img.remarque && img.remarque.trim() !== '')
        console.log('Images avec remarques:', images.value)
    } catch (err) {
        console.error('Erreur lors de la récupération des remarques:', err)
        error.value = "Impossible de charger les remarques"
    } finally {
        loading.value = false
    }
})

// Naviguer vers la page de détail de l'image
const navigateToImage = (imageId) => {
    router.push(`/image/${imageId}`)
}

// Effacer une remarque
const clearRemarque = async (imageId) => {
    try {
        const response = await fetch('/api/images', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: imageId,
                remarque: ''
            })
        })

        const data = await response.json()
        if (data.success) {
            // Retirer l'image de la liste
            images.value = images.value.filter(img => img.id !== imageId)
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la remarque:', err)
    }
}

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4">
        <div class="container mx-auto max-w-6xl">
            <!-- En-tête avec bouton retour -->
            <div class="flex justify-between items-center mb-8">
                <button @click="goHome"
                    class="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center transition-all duration-200 hover:scale-105 transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </button>
                <h1 class="text-4xl font-bold text-gray-800">Remarques</h1>
            </div>

            <!-- Contenu principal -->
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-3xl font-semibold text-gray-800 mb-8">Liste des remarques</h2>

                <!-- État de chargement -->
                <div v-if="loading" class="flex justify-center py-12">
                    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
                    </div>
                </div>

                <!-- Message d'erreur -->
                <div v-else-if="error" class="bg-red-100 text-red-700 p-6 rounded-lg text-xl">
                    {{ error }}
                </div>

                <!-- Aucune remarque -->
                <div v-else-if="images.length === 0" class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 12H4M8 16l-4-4 4-4M16 16l4-4-4-4" />
                    </svg>
                    <p class="text-2xl text-gray-600">Aucune remarque pour le moment</p>
                </div>

                <!-- Liste des remarques -->
                <div v-else class="space-y-6">
                    <div v-for="image in images" :key="image.id"
                        class="flex flex-col md:flex-row items-start p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                        <!-- Miniature de l'image (agrandie) -->
                        <div
                            class="w-full md:w-48 h-48 overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0 border border-gray-200 rounded-lg">
                            <img :src="image.url" :alt="image.filename || 'Image'"
                                class="w-full h-full object-contain" />
                        </div>

                        <!-- Contenu de la remarque (agrandi) -->
                        <div class="flex-grow flex flex-col justify-between w-full">
                            <div class="">
                                <p class="text-xl text-gray-700 break-words mb-4">{{ image.remarque }}</p>
                            </div>

                            <!-- Bouton pour supprimer la remarque (plus grand et plus visible) -->
                            <div class="flex justify-end mt-4">
                                <button @click="clearRemarque(image.id)"
                                    class="cursor-pointer group flex items-center px-6 py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 transform">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                    J'ai vu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>