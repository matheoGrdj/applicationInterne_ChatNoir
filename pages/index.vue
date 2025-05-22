<script setup>
import { useRouter } from '#app'

const router = useRouter()

const navigateToIndexImage = () => {
    router.push(`/image`)
}

const navigateToReceveur = () => {
    router.push(`/receveur`)
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
        <!-- Logo -->
        <div class="mb-16 text-center">
            <!-- <img src="/images/logo.png" alt="Le Chat Noir" class="w-64 h-auto mx-auto mb-4" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/250x150?text=Logo+Chat+Noir'"> -->
            <h1 class="text-4xl font-bold text-gray-800">Le Chat Noir</h1>
        </div>

        <!-- Boutons -->
        <div class="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center">
            <button @click="navigateToIndexImage"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-8 px-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:cursor-pointer flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photos
            </button>

            <button @click="navigateToReceveur"
                class="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xl font-semibold py-8 px-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:cursor-pointer flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Remarques
            </button>
        </div>
    </div>
</template>