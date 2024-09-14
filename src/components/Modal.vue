<!-- src/components/Modal.vue -->
<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

    <!-- 弹窗内容 -->
    <div
      class="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-opacity-60 dark:bg-gradient-to-r dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 backdrop-blur-lg rounded-lg shadow-2xl max-w-md w-full p-6 animate-background-gradient">

      <!-- 关闭按钮 -->
      <button @click="close" class="absolute top-4 right-4 text-white hover:text-gray-300">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </button>

      <!-- 标题 -->
      <h2 class="text-2xl font-semibold mb-4 text-white">项目技术简介</h2>

      <!-- 内容区域 -->
      <div class="text-white space-y-4 max-h-[80vh] overflow-y-auto pr-2 modal-scrollbar">
        <!-- Vue 3 框架与组合式 API -->
        <h3 class="text-xl font-semibold mt-4">Vue 3 框架与组合式 API</h3>
        <p>本项目基于 Vue 3 框架，利用其组合式 API（Composition API）实现了代码逻辑的模块化和复用性。组合式 API
          使得状态管理和逻辑复用更加简洁，提升了代码的可维护性和可读性。</p>

        <!-- 状态机原理及实现 -->
        <h3 class="text-xl font-semibold mt-4">状态机原理及实现</h3>
        <p>计算器的核心逻辑采用了有限状态机（Finite State Machine,
          FSM）的设计模式。状态机通过定义明确的状态和状态之间的转换，管理计算器在不同操作下的行为。</p>
        <ul class="list-disc list-inside">
          <li><strong>原理：</strong>有限状态机由一组状态、事件和转换规则组成。每当发生特定事件时，状态机根据当前状态和事件确定下一个状态。
          </li>
          <li><strong>设计过程中的问题：</strong>若不采用状态机，计算器逻辑可能会导致状态混乱，难以追踪和维护。例如，在处理连续操作符输入或错误输入时，代码逻辑可能变得复杂且易出错。
          </li>
          <li><strong>状态机的解决方案：</strong>通过明确划分状态（如初始状态、输入第一个数、输入操作符、输入第二个数、显示结果等），状态机简化了逻辑流程。每个状态下的行为和可能的状态转换都被清晰定义，避免了状态混乱，提高了代码的可维护性和可靠性。
          </li>
        </ul>

        <!-- Tailwind CSS 样式设计 -->
        <h3 class="text-xl font-semibold mt-4">Tailwind CSS 样式设计</h3>
        <p>项目采用 Tailwind CSS 进行样式设计，利用其原子化的 CSS 类快速构建响应式和可定制的界面。Tailwind
          的实用类使得样式的编写更加高效，同时通过配置文件实现主题定制和暗黑模式支持。</p>

        <!-- 动态背景实现 -->
        <h3 class="text-xl font-semibold mt-4">动态背景实现</h3>
        <p>项目中的动态背景分为两部分：弹窗背景和计算器背景。</p>
        <ul class="list-disc list-inside">
          <li><strong>弹窗背景：</strong>通过 CSS 动画，使用 <code>@keyframes</code> 定义多段渐变颜色，并应用到背景上，创造流动的视觉效果。
          </li>
          <li><strong>计算器背景：</strong>通过监听指针事件和 CSS 动画，创建动态发光效果。</li>
        </ul>

        <!-- 暗黑模式实现 -->
        <h3 class="text-xl font-semibold mt-4">暗黑模式实现</h3>
        <p>项目内置暗黑模式，用户可通过切换按钮在亮色和暗黑模式间切换。利用 Tailwind CSS 的 <code>dark:</code>
          前缀，实现不同模式下的颜色和样式调整，确保在各种光照环境下的良好可读性和视觉体验。</p>

        <!-- 计算器按钮动态布局实现 -->
        <h3 class="text-xl font-semibold mt-4">计算器按钮布局实现</h3>
        <p>计算器按钮采用响应式网格布局（Grid Layout），使用 Tailwind CSS 的 <code>grid-cols-4</code>
          类实现四列布局。确保按钮在不同设备和屏幕尺寸下排列整齐、响应迅速，提升用户操作体验。</p>

        <!-- 键盘录入 -->
        <h3 class="text-xl font-semibold mt-4">键盘输入实现</h3>
        <p>
          支持键盘输入，通过监听键盘事件，实现计算器的快捷操作。用户可直接使用键盘输入数字和操作符，提升操作效率和用户体验。</p>

        <!-- 响应式设计 -->
        <h3 class="text-xl font-semibold mt-4">响应式设计优化</h3>
        <p>在移动端，弹窗的最大宽度调整为
          90%，并缩小标题和子标题的字体大小，确保内容在小屏幕上不会溢出且保持良好的可读性。</p>

        <!-- Icon 引用方案 -->
        <h3 class="text-xl font-semibold mt-4">Icon 方案</h3>
        <p>通过 vue-fontawesome 实现图标的快速引用和使用。FontAwesome
          提供了丰富的图标集，支持多种样式（如实心、常规和品牌图标）。</p>

        <!-- JS 计算精度处理 -->
        <h3 class="text-xl font-semibold mt-4">JS 计算精度方案</h3>
        <p>为了避免 JavaScript 原生数值计算中的浮点精度问题，项目采用了 Decimal.js 库。Decimal.js
          提供了高精度的十进制运算能力，确保计算器在进行加减乘除等运算时的结果准确无误，避免了常见的浮点数误差问题。</p>

        <!-- 项目部署方案 -->
        <h3 class="text-xl font-semibold mt-4">项目部署方案</h3>
        <p>项目采用 GitHub Pages 进行部署，通过 GitHub Actions 自动化构建和部署流程。以下是部署的主要步骤：</p>
        <ul class="list-disc list-inside">
          <li><strong>构建流程：</strong>在每次向 <code>master</code> 分支推送代码时，GitHub Actions
            会自动执行构建任务，安装依赖、构建项目并将生成的静态文件部署到 GitHub Pages。
          </li>
          <li><strong>配置文件：</strong>使用了 <code>Deploy to GitHub Pages</code> 的 GitHub Actions 工作流，确保部署过程的自动化和高效性。
          </li>
        </ul>

        <!-- 项目依赖解决方案 -->
        <h3 class="text-xl font-semibold mt-4">项目依赖解决方案</h3>
        <p>为了确保项目依赖的安全性和最新性，项目集成了 Dependabot。Dependabot
          会定期检查项目的依赖项，自动创建拉取请求以更新存在安全漏洞或过时的依赖包。</p>


      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}

// 禁用背景滚动
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* 动态背景动画 */
@keyframes gradientChange {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-background-gradient {
  background-size: 200% 200%;
  animation: gradientChange 20s ease infinite;
}

/* 自定义滚动条样式（可选） */
.modal-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.modal-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modal-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.modal-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 90%;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }
}
</style>
