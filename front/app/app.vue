<template>
  <div class="min-h-screen bg-bgRoot text-textPrimary selection:bg-accent/20">
    <NuxtPage />
    <BottomNavbar />
  </div>
</template>

<script setup lang="ts">
import BottomNavbar from '~/components/BottomNavbar.vue'
</script>
