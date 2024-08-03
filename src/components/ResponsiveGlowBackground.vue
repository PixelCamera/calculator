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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const containerRef = ref(null);
const position = reactive({ x: 0, y: 0 });
const targetPosition = reactive({ x: 0, y: 0 });
const isActive = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const glowSize = computed(() => isMobile.value ? 300 : 600);

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

const handleTouchStart = (e) => {
  isActive.value = true;
  if (e.touches[0]) {
    updateTargetPosition(e.touches[0].clientX, e.touches[0].clientY);
  }
};

const handleTouchMove = (e) => {
  if (e.touches[0]) {
    updateTargetPosition(e.touches[0].clientX, e.touches[0].clientY);
  }
};

const handleTouchEnd = () => {
  isActive.value = false;
};

const handleMouseEnter = () => {
  isActive.value = true;
};

const handleMouseMove = (e) => {
  updateTargetPosition(e.clientX, e.clientY);
};

const handleMouseLeave = () => {
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
  if (isMobile.value) {
    document.addEventListener('touchstart', handleTouchStart, {passive: true});
    document.addEventListener('touchmove', handleTouchMove, {passive: true});
    document.addEventListener('touchend', handleTouchEnd);
  } else {
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
  }

  requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (isMobile.value) {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  } else {
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
  }
});
</script>
