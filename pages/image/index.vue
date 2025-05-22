<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

const images = ref([])

const navigateToDetail = (imageId) => {
    router.push(`/image/${imageId}`)
}

const navigateToAddImage = () => {
    router.push('/image/add')
}

onMounted(() => {
    // Fetch images from the API
    fetch('/api/images')
        .then(response => response.json())
        .then(data => {
            images.value = data
            console.log('Fetched images:', images.value)
        })
        .catch(error => {
            console.error('Error fetching images:', error)
        })
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

        <!-- Reste du contenu -->
        <div class="container mx-auto max-w-7xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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