<script setup>
import { ref } from 'vue';
import { handleInput, expressionDisplay, valueDisplay, calcState } from '@/composables/useCalculator.js';

// prettier-ignore
const BUTTONS = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "-",
  "C", "0", ".", "+",
  "=",
];

const showInfo = ref(false);

function switchInfo() {
  showInfo.value = !showInfo.value;
}
</script>

<template>
  <p v-if="showInfo" class="text-gray-800 dark:text-gray-100">
    {{ calcState }}
  </p>
  <div
    class="z-10 rounded-lg bg-gray-50 bg-opacity-50 p-6 shadow-md transition-colors duration-300 dark:bg-gray-800 dark:bg-opacity-50"
  >
    <div class="mb-4">
      <div class="mb-2 h-8 w-full overflow-hidden rounded bg-gray-200 p-2 text-right text-lg dark:bg-gray-700">
        {{ expressionDisplay }}
      </div>
      <div class="w-full rounded bg-gray-200 p-2 text-right text-2xl dark:bg-gray-700">
        {{ valueDisplay }}
      </div>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <button v-for="btn in BUTTONS" :key="btn" @click="handleInput(btn)" class="btn-blue">
        {{ btn }}
      </button>
      <button @click="switchInfo()" class="btn-red">INFO</button>
    </div>
  </div>
</template>
