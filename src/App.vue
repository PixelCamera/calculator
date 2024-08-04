<script setup>
import {ref, reactive, computed} from 'vue'
import ResponsiveGlowBackground from "@/components/ResponsiveGlowBackground.vue";
import Decimal from 'decimal.js'; // 引入 Decimal.js 用于精确计算

const showInfo = ref(false);
import {useDarkMode} from '@/components/useDarkMode.vue'; // 导入新的useDarkMode组合式函数
const {isDarkMode, toggleDarkMode} = useDarkMode();

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
const buttons = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', 'C', '0', '.', '+', '=']
const operators = ['+', '-', '×', '÷']

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
    '×': a.times(b),
    '÷': b.isZero() ? 'Error' : a.dividedBy(b)
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

<template>
  <div
      :class="['flex flex-col justify-center items-center min-h-screen gap-4 transition-colors duration-300', isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800']">
    <responsive-glow-background/>
    <p v-if="showInfo" :class="[isDarkMode ? 'text-gray-100' : 'text-gray-800']"> {{ calcState }} </p>
    <div
        :class="['p-6 rounded-lg shadow-md z-10 transition-colors duration-300', isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50 bg-opacity-50']">
      <div class="mb-4">
        <div
            :class="['w-full text-right text-lg p-2 rounded mb-2 h-8 overflow-hidden', isDarkMode ? 'bg-gray-700 ' : 'bg-gray-200 ']">
          {{ expressionDisplay }}
        </div>
        <div
            :class="['w-full text-right text-2xl p-2 rounded', isDarkMode ? 'bg-gray-700 ' : 'bg-gray-200 ']">
          {{ valueDisplay }}
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button
            v-for="btn in buttons"
            :key="btn"
            @click="handleInput(btn)"
            :class="['font-bold py-2 px-4 rounded bg-opacity-90 transition-colors duration-300', isDarkMode ? 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-gray-200' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white']"
        >
          {{ btn }}
        </button>
        <button
            @click="switchInfo()"
            :class="['font-bold py-2 px-4 rounded bg-opacity-90 transition-colors duration-300', isDarkMode ? 'bg-red-700 hover:bg-red-800 active:bg-red-900 text-gray-200' : 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white']"
        >
          INFO
        </button>
      </div>
    </div>
    <div class="flex items-center gap-4 mt-4">
      <span>Made by</span>
      <a href="https://github.com/PixelCamera/calculator" target="_blank"
         class="group hover:text-red-500 flex items-center">
        <font-awesome-icon :icon="['fab','github']"
                           :class="['text-xl group-hover:text-red-600',
                           isDarkMode ? 'text-gray-300' : 'text-gray-700']"/>
        <span class="ml-1">PixelCamera</span>
      </a>
      <button
          @click="toggleDarkMode"
          :class="['w-10 h-10 rounded-full transition-colors duration-300',
          isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-yellow-400']"
      >
        <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" class="text-lg"/>
      </button>
    </div>
  </div>
</template>
