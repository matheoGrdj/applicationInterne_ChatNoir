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
                    <form @submit.prevent="saveRemarque" class="space-y-4">
                        <div>
                            <label for="remarque" class="block text-sm font-medium text-gray-700 mb-2">
                                Votre remarque
                            </label>
                            <textarea id="remarque" v-model="remarque" rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Écrivez votre remarque ici..."></textarea>
                        </div>
                        <button type="submit"
                            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:cursor-pointer">
                            Enregistrer
                        </button>
                    </form>
                </div>

                <div class="col-span-full text-center mt-8">
                    <button @click="deleteImage"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:cursor-pointer">
                        Supprimer l'image et ses informations
                    </button>
                </div>
            </div>

            <div v-else class="text-center py-12">
                <p class="text-gray-600">Chargement...</p>
            </div>
        </div>
    </div>
</template>