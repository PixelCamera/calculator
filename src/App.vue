<template>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <responsive-glow-background/>
    <p v-if="showInfo"> {{ calcState }} </p>
    <div class="bg-white p-6 rounded-lg shadow-md z-10 bg-opacity-50">
      <div class="mb-4">
        <div class="w-full text-right text-lg p-2 bg-gray-900 rounded bg-opacity-10 mb-2 h-8 overflow-hidden">
          {{ expressionDisplay }}
        </div>
        <div class="w-full text-right text-2xl p-2 bg-gray-900 rounded bg-opacity-10">
          {{ valueDisplay }}
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button
            v-for="btn in buttons"
            :key="btn"
            @click="handleInput(btn)"
            class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:bg-blue-600 text-white font-bold py-2 px-4 rounded bg-opacity-90"
        >
          {{ btn }}
        </button>
        <button
            @click="switchInfo()"
            class="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-2 px-4 rounded bg-opacity-90"
        > INFO
        </button>
      </div>
    </div>
    <div>Made by <a href="https://github.com/PixelCamera/calculator" target="_blank" class="hover:text-red-500">PixelCamera</a>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import ResponsiveGlowBackground from "@/components/ResponsiveGlowBackground.vue";
import Decimal from 'decimal.js'; // 引入 Decimal.js 用于精确计算

const showInfo = ref(false);

function switchInfo() {
  showInfo.value = !showInfo.value;
}

// 计算器状态枚举
const STATE_TYPE = {
  INIT: 'INIT',     // 初始状态
  FIRST: 'FIRST',   // 已输入第一个操作数
  SECOND: 'SECOND', // 已输入第二个操作数
  OP: 'OP',         // 已输入运算符
  RESULT: 'RESULT'  // 已显示结果
}

// 初始化响应式状态
const calcState = reactive({
  current: STATE_TYPE.INIT,
  first: '0',
  second: '',
  op: null,
  result: null
})

// 定义计算器按钮
const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '.', '+', '=']
const operators = ['+', '-', '*', '/']

// 辅助函数：检查当前状态
const isState = (...states) => states.includes(calcState.current)

// 辅助函数：格式化数字
function formatNumber(num) {
  if (num === '' || num === null) return '0'
  if (num.toString().endsWith('.')) return num.toString()
  const decimal = new Decimal(num)
  return decimal.abs().gte(1e9) || (decimal.abs().lt(1e-6) && !decimal.isZero())
      ? decimal.toExponential(2)
      : decimal.toDecimalPlaces(6).toFixed()
}

// 计算显示表达式
const expressionDisplay = computed(() => {
  if (isState(STATE_TYPE.RESULT)) {
    return `${formatNumber(calcState.first)} ${calcState.op} ${formatNumber(calcState.second)} =`
  }
  if (isState(STATE_TYPE.SECOND, STATE_TYPE.OP)) {
    return `${formatNumber(calcState.first)} ${calcState.op}`
  }
  return ''
})

// 计算显示值
const valueDisplay = computed(() => {
  if (isState(STATE_TYPE.INIT, STATE_TYPE.FIRST)) {
    return formatNumber(calcState.first)
  }
  if (isState(STATE_TYPE.OP, STATE_TYPE.SECOND)) {
    return formatNumber(calcState.second || calcState.first)
  }
  if (isState(STATE_TYPE.RESULT)) {
    return formatNumber(calcState.result)
  }
  return '0'
})

function appendToOperand(operand, input) {
  if (input === '.' && operand.includes('.')) return operand
  if (operand === '0' && input !== '.') return input
  return operand + input
}

function calculate() {
  const a = new Decimal(calcState.first)
  const b = new Decimal(calcState.second)
  const operations = {
    '+': a.plus(b),
    '-': a.minus(b),
    '*': a.times(b),
    '/': b.isZero() ? 'Error' : a.dividedBy(b)
  }
  return operations[calcState.op]?.toString() ?? 'Error'
}

function handleInput(input) {
  const actions = {
    [STATE_TYPE.INIT]: () => {
      if (input === 'C') return
      if (operators.includes(input)) {
        calcState.op = input
        calcState.current = STATE_TYPE.OP
      } else if (input !== '=') {
        calcState.first = input === '.' ? '0.' : input
        calcState.current = STATE_TYPE.FIRST
      }
    },
    [STATE_TYPE.FIRST]: () => {
      if (input === 'C') {
        calcState.first = '0'
        calcState.current = STATE_TYPE.INIT
      } else if (operators.includes(input)) {
        calcState.op = input
        calcState.current = STATE_TYPE.OP
        if (calcState.first.endsWith('.')) {
          calcState.first = calcState.first.slice(0, -1);
        }
      } else if (input !== '=') {
        calcState.first = appendToOperand(calcState.first, input)
      }
    },
    [STATE_TYPE.OP]: () => {
      if (input === 'C') {
        calcState.first = '0'
        calcState.op = null
        calcState.current = STATE_TYPE.INIT
      } else if (operators.includes(input)) {
        calcState.op = input
      } else if (input !== '=') {
        calcState.second = input === '.' ? '0.' : input
        calcState.current = STATE_TYPE.SECOND
      }
    },
    [STATE_TYPE.SECOND]: () => {
      if (input === 'C') {
        calcState.second = ''
        calcState.current = STATE_TYPE.OP
      } else if (operators.includes(input)) {
        calcState.result = calculate()
        calcState.first = calcState.result
        calcState.second = ''
        calcState.op = input
        calcState.current = STATE_TYPE.OP
      } else if (input === '=') {
        calcState.result = calculate()
        calcState.current = STATE_TYPE.RESULT
      } else {
        calcState.second = appendToOperand(calcState.second, input)
      }
    },
    [STATE_TYPE.RESULT]: () => {
      if (input === 'C') {
        calcState.first = '0'
        calcState.second = ''
        calcState.op = null
        calcState.result = null
        calcState.current = STATE_TYPE.INIT
      } else if (operators.includes(input)) {
        calcState.first = calcState.result
        calcState.second = ''
        calcState.op = input
        calcState.current = STATE_TYPE.OP
      } else if (input !== '=') {
        calcState.first = input === '.' ? '0.' : input
        calcState.second = ''
        calcState.op = null
        calcState.result = null
        calcState.current = STATE_TYPE.FIRST
      }
    }
  }

  actions[calcState.current]()
}
</script>
