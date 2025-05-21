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
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4">
        <!-- Bouton d'ajout -->
        <div class="text-center mb-10">
            <button @click="navigateToAddImage"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:cursor-pointer">
                Ajouter une image
            </button>
        </div>

        <!-- Grille d'images -->
        <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="image in images" :key="image.id"
                    class="cursor-pointer transform transition-transform hover:scale-105"
                    @click="navigateToDetail(image.id)">
                    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                        <div class="w-full aspect-square overflow-hidden rounded-full mb-4">
                            <img :src="image.url" :alt="image.title" class="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>