<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

const images = ref([])
const loading = ref(true)
const error = ref(null)

const navigateToDetail = (imageId) => {
    router.push(`/image/${imageId}`)
}

const navigateToAddImage = () => {
    router.push('/image/add')
}

onMounted(async () => {
    try {
        loading.value = true
        const response = await fetch('/api/images')
        const data = await response.json()

        // S'assurer que c'est un tableau
        images.value = Array.isArray(data) ? data : []
        console.log('Fetched images:', images.value)

    } catch (err) {
        console.error('Error fetching images:', err)
        error.value = "Impossible de charger les images"
        images.value = []
    } finally {
        loading.value = false
    }
})

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4">
        <!-- En-tête avec navigation -->
        <div class="container mx-auto max-w-7xl mb-12">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
                <!-- Bouton retour -->
                <button @click="goHome"
                    class="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center transition-all duration-200 hover:scale-105 transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </button>

                <!-- Bouton d'ajout -->
                <button @click="navigateToAddImage"
                    class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center transition-all duration-200 hover:scale-105 transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une image
                </button>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="container mx-auto max-w-7xl">
            <!-- État de chargement -->
            <div v-if="loading" class="flex justify-center py-12">
                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Message d'erreur -->
            <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ error }}</span>
                </div>
            </div>

            <!-- Aucune image -->
            <div v-else-if="images.length === 0" class="text-center py-16">
                <div class="bg-white rounded-xl shadow-lg p-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 class="text-2xl font-semibold text-gray-800 mb-4">Aucune image disponible</h3>
                    <p class="text-gray-600 mb-8">Commencez par ajouter votre première image</p>
                    <button @click="navigateToAddImage"
                        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter une image
                    </button>
                </div>
            </div>

            <!-- Grille des images -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="image in images" :key="image.id"
                    class="cursor-pointer transform transition-transform hover:scale-105"
                    @click="navigateToDetail(image.id)">
                    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                        <div class="w-full aspect-square overflow-hidden rounded-full mb-4">
                            <img :src="image.url" :alt="image.filename" class="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>