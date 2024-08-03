<template>
  <div
      ref="containerRef"
      class="fixed inset-0 pointer-events-none"
  >
    <div
        class="absolute bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl will-change-transform"
        :style="glowStyle"
    ></div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue';

const containerRef = ref(null);
const position = reactive({x: 0, y: 0});
const targetPosition = reactive({x: 0, y: 0});
const isActive = ref(false);

const glowSize = computed(() => 400);

const glowStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  width: `${glowSize.value}px`,
  height: `${glowSize.value}px`,
  opacity: isActive.value ? 0.5 : 0,
  transform: 'translate(-50%, -50%)',
  transition: 'opacity 0.3s ease-out',
  pointerEvents: 'none',
}));

const updateTargetPosition = (clientX, clientY) => {
  targetPosition.x = clientX;
  targetPosition.y = clientY;
};

const handlePointerOver = (e) => {
  isActive.value = true;
  updateTargetPosition(e.clientX, e.clientY);
};

const handlePointerMove = (e) => {
  updateTargetPosition(e.clientX, e.clientY);
};

const handlePointerLeave = () => {
  isActive.value = false;
};

const animate = () => {
  const dx = targetPosition.x - position.x;
  const dy = targetPosition.y - position.y;
  position.x += dx * 0.1;
  position.y += dy * 0.1;
  requestAnimationFrame(animate);
};

onMounted(() => {
  document.addEventListener('pointerover', handlePointerOver);
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerleave', handlePointerLeave);

  requestAnimationFrame(animate);
});

onUnmounted(() => {
  document.removeEventListener('pointerover', handlePointerOver);
  document.removeEventListener('pointermove', handlePointerMove);
  document.removeEventListener('pointerleave', handlePointerLeave);
});
</script>
