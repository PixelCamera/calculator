<!-- Calculator.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { handleInput, expressionDisplay, valueDisplay, calcState } from '@/composables/useCalculator.js';
import { useDarkMode } from '@/composables/useDarkMode.js';
import Modal from '@/components/Modal.vue'; // 引入 Modal 组件
import { formatNumber } from '@/utils/formatNumber.js'; // 引入格式化函数

const { isDarkMode, toggleDarkMode } = useDarkMode();

// 按钮配置
const BUTTONS = [
  { value: 'C', classes: ['btn-secondary'] },
  { value: '÷', classes: ['btn-secondary', 'text-2xl'] },
  { value: '×', classes: ['btn-secondary', 'text-2xl'] },
  { value: '-', classes: ['btn-secondary', 'text-2xl'] },
  { value: '7', classes: [] },
  { value: '8', classes: [] },
  { value: '9', classes: [] },
  { value: '+', classes: ['row-span-2', 'btn-secondary', 'text-2xl'] },
  { value: '4', classes: [] },
  { value: '5', classes: [] },
  { value: '6', classes: [] },
  { value: '1', classes: [] },
  { value: '2', classes: [] },
  { value: '3', classes: [] },
  { value: '=', classes: ['row-span-2', 'btn-primary', 'text-2xl', 'text-white'] },
  { value: '0', classes: ['col-span-2'] },
  { value: '.', classes: [] },
];

const showInfo = ref(false);
const isModalVisible = ref(false); // 控制弹窗显示

// 切换 info 信息卡片显示
function switchInfo() {
  showInfo.value = !showInfo.value;
}

// 打开项目说明弹窗
function openModal() {
  isModalVisible.value = true;
}

// 关闭项目说明弹窗
function closeModal() {
  isModalVisible.value = false;
}

// 处理键盘输入
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
  <!-- 项目说明弹窗 -->
  <Modal :isVisible="isModalVisible" @close="closeModal" />
  <!-- Info 信息卡片 -->
  <div
    v-if="showInfo"
    class="flex flex-col items-center w-96 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg py-6 animate-fade-in"
  >
    <div class="grid grid-cols-4 gap-4 w-80 text-gray-700 dark:text-gray-300 items-center text-center">
      <span class="font-medium">当前状态</span>
      <span>{{ calcState.current }}</span>

      <span class="font-medium">操作符</span>
      <span>{{ calcState.op || '无' }}</span>

      <span class="font-medium">数字一</span>
      <span>{{ formatNumber(calcState.first) }}</span>

      <span class="font-medium">数字二</span>
      <span>{{ formatNumber(calcState.second) || '无' }}</span>

      <span class="font-medium">计算结果</span>
      <span>{{ formatNumber(calcState.result) || '无' }}</span>
    </div>
  </div>

  <!-- 计算器主体 -->
  <div class="calc-container global-flex flex-col gap-1 p-1 relative">

    <!-- header -->
    <div class="global-flex w-full gap-4 px-4 py-2">
      <font-awesome-icon icon="fa-solid fa-calculator" />
      <h1 class="text-sm">Calculator</h1>
      <span class="flex-1"></span>
    </div>

    <!-- screen -->
    <div class="display-bg global-flex w-full flex-col gap-1 rounded px-1 py-4">
      <div class="h-6 w-full rounded px-1 text-right text-sm text-gray-500 dark:text-gray-400">
        {{ expressionDisplay }}
      </div>
      <div class="w-full rounded px-1 text-right text-5xl">
        {{ valueDisplay }}
      </div>
    </div>

    <!-- functions and description -->
    <div class="flex w-full justify-between items-center gap-4 py-1">
      <!-- 功能按钮区域 -->
      <div class="global-flex flex-row gap-2">
        <!-- info按钮 -->
        <button @click="switchInfo" class="btn-function" title="显示当前状态">
          <font-awesome-icon :icon="['fas', 'code']" />
        </button>
        <!-- dark mode按钮 -->
        <button @click="toggleDarkMode" class="btn-function text-blue-800 dark:text-yellow-300" title="切换暗黑模式">
          <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" />
        </button>
        <!-- 项目说明按钮 -->
        <button @click="openModal" class="btn-function" title="项目说明">
          <font-awesome-icon :icon="['fas', 'info-circle']" />
        </button>
      </div>
    </div>

    <!-- buttons -->
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
