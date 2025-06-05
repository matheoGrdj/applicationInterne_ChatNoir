<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const images = ref([])
const loading = ref(true)
const error = ref(null)
let pollingInterval = null
const POLLING_INTERVAL = 2000

const oldestId = computed(() => {
    if (!images.value.length) return null
    // Filtrer les images avec remarque non vide
    const withRemarque = images.value.filter(img => img.remarque && img.remarque.trim() !== '')
    if (!withRemarque.length) return null
    // Trouver la plus ancienne par updated_at ou created_at
    return withRemarque.reduce((oldest, img) => {
        const dateOldest = new Date(oldest.updated_at || oldest.created_at || 0)
        const dateImg = new Date(img.updated_at || img.created_at || 0)
        return dateImg < dateOldest ? img : oldest
    }, withRemarque[0]).id
})

// Computed pour trier les remarques de la plus ancienne à la plus récente
const sortedImages = computed(() => {
    return [...images.value].sort((a, b) => {
        // Trier par updated_at (plus ancien en premier pour les remarques)
        // Le tri utilise déjà les millisecondes complètes du timestamp ISO
        const dateA = new Date(a.updated_at || a.created_at || 0)
        const dateB = new Date(b.updated_at || b.created_at || 0)
        return dateA - dateB
    })
})

// Fonction pour formater la date avec les secondes pour plus de précision
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit' // Ajout des secondes
    })
}

// Fonction pour récupérer les remarques
const fetchRemarques = async () => {
    try {
        const response = await fetch('/api/images')
        const data = await response.json()

        // S'assurer que c'est un tableau et filtrer pour ne garder que les images avec des remarques
        const allImages = Array.isArray(data) ? data : []
        const newImages = allImages.filter(img => img.remarque && img.remarque.trim() !== '')

        // Ajouter les timestamps manquants pour la rétrocompatibilité
        const now = new Date().toISOString()
        const imagesWithTimestamps = newImages.map(image => {
            if (!image.created_at) {
                image.created_at = now
            }
            if (!image.updated_at) {
                image.updated_at = image.created_at
            }
            return image
        })

        // Vérifier s'il y a de nouvelles remarques
        if (JSON.stringify(imagesWithTimestamps) !== JSON.stringify(images.value)) {
            console.log('Mise à jour des remarques détectée')
            images.value = imagesWithTimestamps
        }

        // Si c'est le premier chargement, désactiver l'état de chargement
        if (loading.value) {
            loading.value = false
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des remarques:', err)
        error.value = "Impossible de charger les remarques"
        loading.value = false
        images.value = []
    }
}

// Récupérer les remarques au chargement et configurer le polling
onMounted(() => {
    // Récupération initiale
    fetchRemarques()

    // Configurer le polling pour les mises à jour en temps réel
    if (process.client) {  // Vérifier qu'on est côté client
        pollingInterval = setInterval(fetchRemarques, POLLING_INTERVAL)
    }
})

// Nettoyer l'intervalle quand le composant est détruit
onBeforeUnmount(() => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
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
                remarque: '',
                vu: true
            })
        })
        const data = await response.json()
        if (data.success) {
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

                <!-- Aucune remarque -->
                <div v-else-if="sortedImages.length === 0" class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="text-2xl font-semibold text-gray-800 mb-4">Aucune remarque pour le moment</h3>
                    <p class="text-gray-600">Les remarques apparaîtront ici lorsqu'elles seront ajoutées.</p>
                </div>

                <!-- Liste des remarques avec animation -->
                <div v-else class="space-y-6">
                    <transition-group name="list" tag="div" class="space-y-6">
                        <div v-for="image in sortedImages" :key="image.id"
                            :class="['flex flex-col md:flex-row items-start p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors', oldestId === image.id ? 'highlight-remark' : '']">
                            <!-- Miniature de l'image (agrandie) -->
                            <div @click="navigateToImage(image.id)"
                                class="w-full md:w-48 h-48 overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0 border border-gray-200 rounded-lg cursor-pointer">
                                <img :src="image.url" :alt="image.filename || 'Image'"
                                    class="w-full h-full object-contain" />
                            </div>

                            <!-- Contenu de la remarque (agrandi) -->
                            <div class="flex-grow flex flex-col justify-between w-full">
                                <div @click="navigateToImage(image.id)" class="cursor-pointer">
                                    <p class="text-xl text-gray-700 break-words mb-4">{{ image.remarque }}</p>
                                    <!-- Affichage de la date de modification avec les secondes -->
                                    <p class="text-sm text-gray-500 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Modifié le {{ formatDate(image.updated_at) }}
                                    </p>
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
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Animation pour les éléments qui apparaissent/disparaissent */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

/* Animation subtile pour indiquer un nouveau contenu */
@keyframes highlight {
    0% {
        background-color: rgba(209, 250, 229, 0.8);
    }

    100% {
        background-color: transparent;
    }
}

.highlight {
    animation: highlight 2s ease-out;
}

@keyframes highlightRemark {
    0% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.8), 0 0 0 0 rgba(59, 130, 246, 0.7);
        background: #f0fff4;
        transform: scale(1.05) rotate(-2deg);
    }

    20% {
        box-shadow: 0 0 40px 10px rgba(34, 197, 94, 0.8), 0 0 80px 20px rgba(59, 130, 246, 0.7);
        background: #bbf7d0;
        transform: scale(1.10) rotate(2deg);
    }

    50% {
        box-shadow: 0 0 60px 20px rgba(59, 130, 246, 0.7), 0 0 80px 20px rgba(34, 197, 94, 0.8);
        background: #f0abfc;
        transform: scale(1.13) rotate(-3deg);
    }

    80% {
        box-shadow: 0 0 40px 10px rgba(34, 197, 94, 0.8), 0 0 80px 20px rgba(59, 130, 246, 0.7);
        background: #bbf7d0;
        transform: scale(1.10) rotate(2deg);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0), 0 0 0 0 rgba(59, 130, 246, 0);
        background: #f9fafb;
        transform: scale(1) rotate(0deg);
    }
}

.highlight-remark {
    animation: highlightRemark 2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    position: relative;
}
</style>