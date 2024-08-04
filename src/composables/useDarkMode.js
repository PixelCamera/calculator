import { ref, onMounted } from 'vue';

export function useDarkMode() {
  const isDarkMode = ref(false);

  // 检查本地存储中的偏好设置
  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = theme => localStorage.setItem('theme', theme);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme(isDarkMode.value);
  };

  // 应用主题
  const applyTheme = isDark => {
    document.documentElement.classList.toggle('dark', isDark);
    setStoredTheme(isDark ? 'dark' : 'light');
  };

  // 初始化主题
  onMounted(() => {
    const storedTheme = getStoredTheme();
    isDarkMode.value = storedTheme === 'dark';
    applyTheme(isDarkMode.value);
  });

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
