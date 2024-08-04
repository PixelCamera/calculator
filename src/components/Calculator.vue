<script setup>
import { ref } from 'vue';
import { handleInput, expressionDisplay, valueDisplay, calcState } from '@/composables/useCalculator.js';

// prettier-ignore
const BUTTONS = [
  {value: 'C', classes: []},
  {value: '÷', classes: []},
  {value: '×', classes: []},
  {value: '-', classes: []},
  {value: '7', classes: []},
  {value: '8', classes: []},
  {value: '9', classes: []},
  {value: '+', classes: ['row-span-2']},
  {value: '4', classes: []},
  {value: '5', classes: []},
  {value: '6', classes: []},
  {value: '1', classes: []},
  {value: '2', classes: []},
  {value: '3', classes: []},
  {value: '=', classes: ['row-span-2']},
  {value: '0', classes: ['col-span-2']},
  {value: '.', classes: []},
];

const showInfo = ref(false);

function switchInfo() {
  showInfo.value = !showInfo.value;
}
</script>

<template>
  <!--info-->
  <p v-if="showInfo" class="w-full px-8 py-2 text-center">{{ calcState }}</p>

  <!--calculator-->
  <div class="calc-container global-flex flex-col gap-8 p-8">
    <!--display-->
    <div class="global-flex w-full flex-col gap-4">
      <div class="calc-display h-10 text-2xl">{{ expressionDisplay }}</div>
      <div class="calc-display text-3xl">{{ valueDisplay }}</div>
    </div>

    <!--buttons-->
    <div class="grid grid-cols-4 gap-3 font-mono">
      <button
        v-for="btn in BUTTONS"
        :key="btn.value"
        @click="handleInput(btn.value)"
        :class="['btn-blue', 'text-4xl', ...btn.classes]"
      >
        {{ btn.value }}
      </button>
      <button @click="switchInfo()" class="btn-red text-2xl">INFO</button>
    </div>
  </div>
</template>
