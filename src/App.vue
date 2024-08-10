<script setup>
import ResponsiveGlowBackground from '@/components/ResponsiveGlowBackground.vue';
import Calculator from '@/components/Calculator.vue';
</script>

<template>
  <div class="global-text global-animate global-flex global-bg min-h-screen select-none flex-col gap-10">
    <responsive-glow-background />
    <calculator class="z-10" />
    <div class="global-flex z-10 gap-3">
      <span>Made by</span>
      <a href="https://github.com/PixelCamera/calculator" target="_blank" class="global-flex gap-1 hover:text-red-600">
        <font-awesome-icon :icon="['fab', 'github']" class="text-2xl" />
        <span>PixelCamera</span>
      </a>
    </div>
  </div>
</template>
