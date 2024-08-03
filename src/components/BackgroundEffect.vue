<template>
  <div
      class="fixed inset-0 pointer-events-none"
      ref="containerRef"
  >
    <div
        class="absolute bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
        :style="glowStyle"
    ></div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted} from 'vue';

const containerRef = ref(null);
const mousePosition = reactive({x: 0, y: 0});
const isMouseInside = ref(false);

const handleMouseMove = (event) => {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  isMouseInside.value = true;
};

const handleMouseLeave = () => {
  isMouseInside.value = false;
};

const glowSize = 600; // 光晕的直径

const glowStyle = reactive({
  left: '0px',
  top: '0px',
  width: `${glowSize}px`,
  height: `${glowSize}px`,
  opacity: 0,
  transform: 'translate(-50%, -50%)'
});

const updateGlowEffect = () => {
  if (isMouseInside.value) {
    glowStyle.left = `${mousePosition.x}px`;
    glowStyle.top = `${mousePosition.y}px`;
    glowStyle.opacity = 0.2;
  } else {
    glowStyle.opacity = 0;
  }
};

let animationFrameId = null;

const animate = () => {
  updateGlowEffect();
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
