<template>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <responsive-glow-background />
    <div class="bg-white p-6 rounded-lg shadow-md z-10 bg-opacity-50">
      <div class="mb-4">
        <div class="w-full text-right text-lg p-2 bg-gray-100 rounded bg-opacity-90 mb-2 h-8 overflow-hidden">
          {{ expressionDisplay }}
        </div>
        <input
            type="text"
            :value="resultDisplay"
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
import { ref, computed } from 'vue'
import ResponsiveGlowBackground from "@/components/ResponsiveGlowBackground.vue";
import Decimal from 'decimal.js';

const currentInput = ref('')
const expression = ref('')
const lastResult = ref(null)
const lastOperator = ref(null)
const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '.', '+', '=']

Decimal.set({ precision: 8, rounding: 4 })

const expressionDisplay = computed(() => expression.value || ' ')
const resultDisplay = computed(() => {
  if (currentInput.value === '') return lastResult.value || '0'
  if (currentInput.value === '.') return '0.'
  return new Decimal(currentInput.value).toDecimalPlaces(8).toString()
})

function handleClick(value) {
  if (value === 'C') {
    clear()
  } else if (value === '=') {
    calculate()
  } else if (['+', '-', '*', '/'].includes(value)) {
    setOperator(value)
  } else {
    appendNumber(value)
  }
}

function clear() {
  currentInput.value = ''
  expression.value = ''
  lastResult.value = null
  lastOperator.value = null
}

function appendNumber(number) {
  if (lastResult.value !== null && !lastOperator.value) {
    clear()
  }
  if (number === '.' && currentInput.value.includes('.')) return
  if (number === '.' && currentInput.value === '') {
    currentInput.value = '0.'
  } else {
    currentInput.value += number
  }
}

function setOperator(op) {
  if (currentInput.value === '' && expression.value === '' && lastResult.value === null) return

  if (lastOperator.value && currentInput.value === '') {
    lastOperator.value = op
    expression.value = expression.value.slice(0, -2) + op + ' '
    return
  }

  if (currentInput.value !== '' || lastResult.value !== null) {
    calculate()
    lastOperator.value = op
    expression.value = resultDisplay.value + ' ' + op + ' '
    currentInput.value = ''
  }
}

function calculate() {
  if (lastOperator.value === null) {
    lastResult.value = currentInput.value || lastResult.value
    currentInput.value = ''
    return
  }

  const a = new Decimal(lastResult.value || '0')
  const b = new Decimal(currentInput.value || lastResult.value)
  let result

  try {
    switch (lastOperator.value) {
      case '+': result = a.plus(b); break
      case '-': result = a.minus(b); break
      case '*': result = a.times(b); break
      case '/':
        if (b.isZero()) throw new Error('Division by zero')
        result = a.dividedBy(b)
        break
    }

    lastResult.value = result.toString()
    expression.value += (currentInput.value || lastResult.value) + ' = '
    currentInput.value = ''
    lastOperator.value = null
  } catch (error) {
    currentInput.value = 'Error: ' + error.message
    lastResult.value = null
    lastOperator.value = null
  }
}
</script>
