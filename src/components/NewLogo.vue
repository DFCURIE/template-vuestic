<template>
  <img :src="logoSrc" :height="height" :width="width" alt="New Logo" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  height?: number
  width?: number
}>()

// Import the logo image using the ES6 import statement
import logoImage from '@/assets/new-logo.png'

const logoSrc = logoImage
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
