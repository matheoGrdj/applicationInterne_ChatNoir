<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()
const image = ref(null)
const remarque = ref('')

onMounted(async () => {
    try {
        const response = await fetch(`/api/images/${route.params.id}`)
        const data = await response.json()
        image.value = data
        remarque.value = data.remarque
    } catch (error) {
        console.error('Error fetching image:', error)
    }
})

const goBack = () => {
    router.push('/')
}

const saveRemarque = async () => {
    try {
        const response = await fetch('/api/images', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: image.value.id,
                remarque: remarque.value
            })
        })
        const data = await response.json()
        if (data.success) {
            image.value.remarque = remarque.value
        }
    } catch (error) {
        console.error('Error saving remarque:', error)
    }
}

const clearRemarque = async () => {
    try {
        const response = await fetch('/api/images', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: image.value.id,
                remarque: ''
            })
        })
        const data = await response.json()
        if (data.success) {
            remarque.value = ''
            image.value.remarque = ''
        }
    } catch (error) {
        console.error('Error clearing remarque:', error)
    }
}

const deleteImage = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
        try {
            const response = await fetch('/api/images', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: image.value.id
                })
            })
            const data = await response.json()
            if (data.success) {
                router.push('/')
            }
        } catch (error) {
            console.error('Error deleting image:', error)
        }
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4">
        <div class="container mx-auto">
            <button @click="goBack"
                class="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:cursor-pointer">
                Retour
            </button>

            <div v-if="image" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Image à gauche -->
                <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                    <div class="w-full aspect-square overflow-hidden mb-4">
                        <img :src="image.url" :alt="image.title" class="w-full h-full object-contain" />
                    </div>
                </div>

                <!-- Formulaire à droite -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ajouter une remarque</h2>
                    <form @submit.prevent="saveRemarque" class="space-y-6">
                        <div>
                            <label for="remarque" class="block text-sm font-medium text-gray-700 mb-2">
                                Votre remarque
                            </label>
                            <textarea id="remarque" v-model="remarque" rows="6"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Écrivez votre remarque ici..."></textarea>
                        </div>
                        <div class="flex gap-4">
                            <button type="submit"
                                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:cursor-pointer">
                                Enregistrer
                            </button>
                            <button type="button" @click="clearRemarque"
                                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:cursor-pointer">
                                Supprimer la remarque
                            </button>
                        </div>
                    </form>
                </div>

                <div class="col-span-full text-center mt-8">
                    <button @click="deleteImage"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:cursor-pointer">
                        Supprimer l'image et ses informations
                    </button>
                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4">
                </div>
                <p class="text-lg font-medium text-gray-600">Chargement de l'image...</p>
            </div>
        </div>
    </div>
</template>