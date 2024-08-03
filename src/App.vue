<template>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <BackgroundEffect />
    <div class="bg-white p-6 rounded-lg shadow-md z-10 bg-opacity-50">
      <div class="mb-4">
        <input
            type="text"
            v-model="display"
            readonly
            class="w-full text-right text-2xl p-2 bg-gray-200 rounded bg-opacity-90"
        />
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button
            v-for="btn in buttons"
            :key="btn"
            @click="handleClick(btn)"
            class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:bg-blue-600 text-white font-bold py-2 px-4 rounded bg-opacity-90"
        >
          {{ btn }}
        </button>
      </div>
    </div>

    <p>Made by PixelCamera</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackgroundEffect from "@/components/BackgroundEffect.vue";

const display = ref('0')
const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+']

function handleClick(value) {
  if (value === 'C') {
    display.value = '0'
  } else if (value === '=') {
    try {
      display.value = eval(display.value).toString()
    } catch (e) {
      display.value = 'Error'
    }
  } else {
    if (display.value === '0' || display.value === 'Error') {
      display.value = value
    } else {
      display.value += value
    }
  }
}
</script>
