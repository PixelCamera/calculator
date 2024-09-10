<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { handleInput, expressionDisplay, valueDisplay, calcState } from '@/composables/useCalculator.js';
import { useDarkMode } from '@/composables/useDarkMode.js';

const { isDarkMode, toggleDarkMode } = useDarkMode();
// prettier-ignore
const BUTTONS = [
  {value: 'C', classes: ['btn-secondary']},
  {value: '÷', classes: ['btn-secondary','text-2xl']},
  {value: '×', classes: ['btn-secondary','text-2xl']},
  {value: '-', classes: ['btn-secondary','text-2xl']},
  {value: '7', classes: []},
  {value: '8', classes: []},
  {value: '9', classes: []},
  {value: '+', classes: ['row-span-2','btn-secondary','text-2xl']},
  {value: '4', classes: []},
  {value: '5', classes: []},
  {value: '6', classes: []},
  {value: '1', classes: []},
  {value: '2', classes: []},
  {value: '3', classes: []},
  {value: '=', classes: ['row-span-2','btn-primary','text-2xl','text-white']},
  {value: '0', classes: ['col-span-2']},
  {value: '.', classes: []},
];

const showInfo = ref(false);

function switchInfo() {
  showInfo.value = !showInfo.value;
}

function handleKeyDown(event) {
  const key = event.key;
  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', 'Backspace', 'Escape'];
  
  if (validKeys.includes(key)) {
    event.preventDefault();
    let input = key;
    
    if (key === 'Enter') input = '=';
    else if (key === '*') input = '×';
    else if (key === '/') input = '÷';
    else if (key === 'Backspace') input = 'C';
    else if (key === 'Escape') input = 'C';
    
    handleInput(input);
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <!--info-->
  <p v-if="showInfo" class="w-full px-8 py-2 text-center">{{ calcState }}</p>

  <!--calculator-->
  <div class="calc-container global-flex m-4 flex-col gap-1 p-1">
    <!--header-->
    <div class="global-flex w-full gap-4 px-4 py-2">
      <font-awesome-icon icon="fa-solid fa-calculator" />
      <h1 class="text-sm">Calculator</h1>
      <span class="flex-1"></span>
    </div>

    <!--screen-->
    <div class="display-bg global-flex w-full flex-col gap-1 rounded px-1 py-4">
      <div class="h-6 w-full rounded px-1 text-right text-sm text-gray-500 dark:text-gray-400">
        {{ expressionDisplay }}
      </div>
      <div class="w-full rounded px-1 text-right text-5xl">
        {{ valueDisplay }}
      </div>
    </div>

    <!--functions-->
    <div class="grid w-full grid-cols-8 gap-1">
      <!--info-->
      <button @click="switchInfo()" class="btn-function">
        <font-awesome-icon :icon="['fas', 'code']" />
      </button>
      <!--dark mode-->
      <button @click="toggleDarkMode" class="btn-function text-blue-800 dark:text-yellow-300">
        <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" />
      </button>
      <span class="flex-1"></span>
    </div>

    <!--buttons-->
    <div class="grid w-full grid-cols-4 gap-1">
      <button
        v-for="btn in BUTTONS"
        :key="btn.value"
        @click="handleInput(btn.value)"
        :class="['btn-default', ...btn.classes]"
      >
        {{ btn.value }}
      </button>
    </div>
  </div>
</template>
