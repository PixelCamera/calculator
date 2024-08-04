<script setup>
import ResponsiveGlowBackground from '@/components/ResponsiveGlowBackground.vue';
import Calculator from '@/components/Calculator.vue';
import { useDarkMode } from '@/composables/useDarkMode.js';

const { isDarkMode, toggleDarkMode } = useDarkMode();
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
  >
    <responsive-glow-background />
    <calculator />
    <div class="mt-4 flex items-center gap-4">
      <span>Made by</span>
      <a
        href="https://github.com/PixelCamera/calculator"
        target="_blank"
        class="group flex items-center hover:text-red-500"
      >
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="text-xl text-gray-700 group-hover:text-red-600 dark:text-gray-300"
        />
        <span class="ml-1">PixelCamera</span>
      </a>
      <button
        @click="toggleDarkMode"
        class="h-10 w-10 rounded-full bg-gray-700 text-yellow-400 transition-colors duration-300 dark:bg-yellow-400 dark:text-gray-900"
      >
        <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" class="text-lg" />
      </button>
    </div>
  </div>
</template>
