<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()
const image = ref(null)
const remarque = ref('')
const pollingInterval = ref(null)
const POLLING_INTERVAL = 2000
const isPollingActive = ref(true)
const showSaveSuccess = ref(false) // Pour afficher le message de succès

// Vérifier si l'image a été vue
const hasBeenSeen = computed(() => {
    return image.value && image.value.vu === true
})

// Fonction pour démarrer le polling
const startPolling = () => {
    if (!pollingInterval.value) {
        console.log('Démarrage du polling')
        pollingInterval.value = setInterval(fetchImageData, POLLING_INTERVAL)
        isPollingActive.value = true
    }
}

// Fonction pour arrêter le polling
const stopPolling = () => {
    if (pollingInterval.value) {
        console.log('Arrêt du polling')
        clearInterval(pollingInterval.value)
        pollingInterval.value = null
        isPollingActive.value = false
    }
}

// Fonction pour récupérer les données de l'image
const fetchImageData = async () => {
    try {
        // Si le polling est suspendu, ne pas récupérer les données
        if (!isPollingActive.value) return

        const response = await fetch(`/api/images/${route.params.id}`)
        const data = await response.json()

        // Si l'état "vu" a changé, mettre à jour l'image
        if (!image.value || image.value.vu !== data.vu) {
            console.log('État "vu" mis à jour:', data.vu)
            image.value = data
        } else {
            // Sinon, juste mettre à jour les autres propriétés
            image.value = data
        }

        // Ne pas écraser la remarque si l'utilisateur est en train de la modifier
        if (document.activeElement?.id !== 'remarque') {
            remarque.value = data.remarque
        }
    } catch (error) {
        console.error('Error fetching image:', error)
    }
}

// Watch pour suspendre le polling quand hasBeenSeen est true
watch(hasBeenSeen, (newValue) => {
    if (newValue === true) {
        // Si l'image a été vue, arrêter le polling
        stopPolling()
    } else {
        // Sinon, redémarrer le polling
        startPolling()
    }
}, { immediate: true })

// Lorsque l'utilisateur commence à éditer le champ remarque
const onRemarqueEdit = () => {
    if (hasBeenSeen.value) {
        // Arrêter temporairement le polling lorsque l'utilisateur édite
        stopPolling()
    }
}

onMounted(async () => {
    // Première récupération des données
    await fetchImageData()

    // Configurer un polling pour vérifier les mises à jour de l'attribut "vu"
    if (!hasBeenSeen.value) {
        startPolling()
    }
})

// Nettoyer l'intervalle quand le composant est détruit
onUnmounted(() => {
    stopPolling()
})

const goBack = () => {
    router.push('/image')
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
                remarque: remarque.value,
                vu: false // Réinitialiser l'état "vu" lorsqu'on ajoute une nouvelle remarque
            })
        })
        const data = await response.json()
        if (data.success) {
            image.value.remarque = remarque.value
            image.value.vu = false

            // Afficher le message de succès
            showSaveSuccess.value = true

            // Cacher le message après 3 secondes
            setTimeout(() => {
                showSaveSuccess.value = false
            }, 3000)

            // Redémarrer le polling car l'état vu est maintenant false
            startPolling()
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
                remarque: '',
            })
        })
        const data = await response.json()
        if (data.success) {
            remarque.value = ''
            image.value.remarque = ''
        }
        router.push('/image')
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
            <!-- Notification "Vu par la cabine" -->
            <transition name="fade">
                <div v-if="hasBeenSeen"
                    class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="font-medium">La cabine a vu cette remarque !</span>
                </div>
            </transition>

            <button @click="goBack"
                class="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:cursor-pointer flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
            </button>

            <div v-if="image" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Image à gauche -->
                <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                    <div class="w-full aspect-square overflow-hidden mb-4">
                        <img :src="image.url" :alt="image.title" class="w-full h-full object-contain" />
                    </div>

                    <!-- Badge "Vu" -->
                    <div v-if="hasBeenSeen"
                        class="mt-4 py-2 px-4 bg-green-100 text-green-700 rounded-full font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Vu par la cabine
                    </div>
                </div>

                <!-- Formulaire à droite -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ajouter une remarque</h2>

                    <!-- Message de succès -->
                    <transition name="fade">
                        <div v-if="showSaveSuccess"
                            class="mb-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span class="font-medium">Remarque enregistrée avec succès !</span>
                        </div>
                    </transition>

                    <form @submit.prevent="saveRemarque" class="space-y-6">
                        <div>
                            <label for="remarque" class="block text-sm font-medium text-gray-700 mb-2">
                                Votre remarque
                            </label>
                            <textarea id="remarque" v-model="remarque" rows="6" @focus="onRemarqueEdit"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Écrivez votre remarque ici..."></textarea>
                        </div>
                        <div class="flex gap-4">
                            <button type="submit"
                                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:cursor-pointer flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Animation pour le message de succès */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.pulse {
    animation: pulse 2s ease-in-out;
}
</style>