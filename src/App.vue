<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <input
            type="text"
            v-model="display"
            readonly
            class="w-full text-right text-2xl p-2 bg-gray-200 rounded"
        />
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button
            v-for="btn in buttons"
            :key="btn"
            @click="handleClick(btn)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {{ btn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
