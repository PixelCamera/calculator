<template>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <responsive-glow-background />
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
import { reactive, computed } from 'vue'
import ResponsiveGlowBackground from "@/components/ResponsiveGlowBackground.vue";
import Decimal from 'decimal.js'; // 引入 Decimal.js 用于精确计算

// 定义计算器状态
const CalculatorState = {
  INIT: 'INIT',
  ENTERING_FIRST_OPERAND: 'ENTERING_FIRST_OPERAND',
  ENTERING_SECOND_OPERAND: 'ENTERING_SECOND_OPERAND',
  OPERATOR_ENTERED: 'OPERATOR_ENTERED',
  RESULT_DISPLAYED: 'RESULT_DISPLAYED'
}

// 初始化响应式状态
const state = reactive({
  currentState: CalculatorState.INIT,
  firstOperand: '0',
  secondOperand: '',
  operator: null,
  result: null
})

// 定义计算器按钮
const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '.', '+', '=']

// 检查按钮是否为运算符
const isOperator = (btn) => ['+', '-', '*', '/'].includes(btn)

// 格式化数字显示
function formatNumber(num) {
  if (num === '' || num === null) return '0'
  // 如果输入以小数点结尾，保留小数点
  if (num.toString().endsWith('.')) return num.toString()
  const decimal = new Decimal(num)
  if (decimal.abs().gte(1e9) || (decimal.abs().lt(1e-6) && !decimal.isZero())) {
    // 使用科学计数法
    return decimal.toExponential(2)
  } else {
    // 最多显示 6 位小数，去掉末尾的零，但保留小数点后至少一位
    return decimal.toDecimalPlaces(6).toFixed()
  }
}

// 计算显示表达式
const expressionDisplay = computed(() => {
  if (state.currentState === CalculatorState.RESULT_DISPLAYED) {
    return `${formatNumber(state.firstOperand)} ${state.operator} ${formatNumber(state.secondOperand)} =`
  } else if (state.currentState === CalculatorState.ENTERING_SECOND_OPERAND || state.currentState === CalculatorState.OPERATOR_ENTERED) {
    return `${formatNumber(state.firstOperand)} ${state.operator}`
  }
  return ''
})

// 计算显示值
const valueDisplay = computed(() => {
  switch (state.currentState) {
    case CalculatorState.INIT:
    case CalculatorState.ENTERING_FIRST_OPERAND:
      return formatNumber(state.firstOperand)
    case CalculatorState.OPERATOR_ENTERED:
    case CalculatorState.ENTERING_SECOND_OPERAND:
      return formatNumber(state.secondOperand || state.firstOperand)
    case CalculatorState.RESULT_DISPLAYED:
      return formatNumber(state.result)
    default:
      return '0'
  }
})

// 添加数字到操作数
function appendDigit(operand, digit) {
  if (operand === '0' && digit !== '.') return digit
  return operand + digit
}

// 添加小数点到操作数
function appendDecimal(operand) {
  if (operand.includes('.')) return operand
  return operand + '.'
}

// 使用 Decimal.js 进行精确计算
function calculate() {
  const a = new Decimal(state.firstOperand)
  const b = new Decimal(state.secondOperand)
  let result
  switch (state.operator) {
    case '+': result = a.plus(b); break
    case '-': result = a.minus(b); break
    case '*': result = a.times(b); break
    case '/': result = b.isZero() ? 'Error' : a.dividedBy(b); break
  }
  return result === 'Error' ? 'Error' : result.toString()
}

// 处理输入
function handleClick(input) {
  switch (state.currentState) {
    case CalculatorState.INIT:
      handleInitState(input)
      break
    case CalculatorState.ENTERING_FIRST_OPERAND:
      handleEnteringFirstOperandState(input)
      break
    case CalculatorState.OPERATOR_ENTERED:
      handleOperatorEnteredState(input)
      break
    case CalculatorState.ENTERING_SECOND_OPERAND:
      handleEnteringSecondOperandState(input)
      break
    case CalculatorState.RESULT_DISPLAYED:
      handleResultDisplayedState(input)
      break
  }
}

// 处理初始状态输入
function handleInitState(input) {
  if (input === 'C') return
  if (isOperator(input)) {
    state.operator = input
    state.currentState = CalculatorState.OPERATOR_ENTERED
  } else if (input === '.') {
    state.firstOperand = '0.'
    state.currentState = CalculatorState.ENTERING_FIRST_OPERAND
  } else if (input !== '=') {
    state.firstOperand = input
    state.currentState = CalculatorState.ENTERING_FIRST_OPERAND
  }
}

// 处理输入第一个操作数状态的输入
function handleEnteringFirstOperandState(input) {
  if (input === 'C') {
    state.firstOperand = '0'
    state.currentState = CalculatorState.INIT
  } else if (isOperator(input)) {
    state.operator = input
    state.currentState = CalculatorState.OPERATOR_ENTERED
  } else if (input === '.') {
    state.firstOperand = appendDecimal(state.firstOperand)
  } else if (input !== '=') {
    state.firstOperand = appendDigit(state.firstOperand, input)
  }
}

// 处理已输入运算符状态的输入
function handleOperatorEnteredState(input) {
  if (input === 'C') {
    state.firstOperand = '0'
    state.operator = null
    state.currentState = CalculatorState.INIT
  } else if (isOperator(input)) {
    state.operator = input
  } else if (input === '.') {
    state.secondOperand = '0.'
    state.currentState = CalculatorState.ENTERING_SECOND_OPERAND
  } else if (input !== '=') {
    state.secondOperand = input
    state.currentState = CalculatorState.ENTERING_SECOND_OPERAND
  }
}

// 处理输入第二个操作数状态的输入
function handleEnteringSecondOperandState(input) {
  if (input === 'C') {
    state.secondOperand = ''
    state.currentState = CalculatorState.OPERATOR_ENTERED
  } else if (isOperator(input)) {
    state.result = calculate()
    state.firstOperand = state.result.toString()
    state.secondOperand = ''
    state.operator = input
    state.currentState = CalculatorState.OPERATOR_ENTERED
  } else if (input === '.') {
    state.secondOperand = appendDecimal(state.secondOperand)
  } else if (input === '=') {
    state.result = calculate()
    state.currentState = CalculatorState.RESULT_DISPLAYED
  } else {
    state.secondOperand = appendDigit(state.secondOperand, input)
  }
}

// 处理显示结果状态的输入
function handleResultDisplayedState(input) {
  if (input === 'C') {
    state.firstOperand = '0'
    state.secondOperand = ''
    state.operator = null
    state.result = null
    state.currentState = CalculatorState.INIT
  } else if (isOperator(input)) {
    state.firstOperand = state.result.toString()
    state.secondOperand = ''
    state.operator = input
    state.currentState = CalculatorState.OPERATOR_ENTERED
  } else if (input === '.') {
    state.firstOperand = '0.'
    state.secondOperand = ''
    state.operator = null
    state.result = null
    state.currentState = CalculatorState.ENTERING_FIRST_OPERAND
  } else if (input !== '=') {
    state.firstOperand = input
    state.secondOperand = ''
    state.operator = null
    state.result = null
    state.currentState = CalculatorState.ENTERING_FIRST_OPERAND
  }
}
</script>
