<template>
  <div class="min-h-screen bg-bgRoot text-textPrimary flex flex-col items-center justify-center">
    <ArestaLogoGraph :size="48" to="/canvas" />
    <p class="text-xs text-textSecondary mt-3 font-interface">Carregando seus quadros...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ArestaLogoGraph from '~/components/ArestaLogoGraph.vue'

onMounted(() => {
  navigateTo('/canvas', { replace: true })
})
</script>
