<script>
import { ref, onMounted, watch } from 'vue';

export function useDarkMode() {
  const isDarkMode = ref(false);

  // 检查本地存储中的偏好设置
  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = (theme) => localStorage.setItem('theme', theme);

  // 根据系统偏好设置初始主题
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // 切换暗黑模式
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    setStoredTheme(isDarkMode.value ? 'dark' : 'light');
  };

  // 应用主题
  const applyTheme = (theme) => {
    isDarkMode.value = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  };

  // 监听系统主题变化
  const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
  systemThemeListener.addListener((e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 初始化主题
  onMounted(() => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme(getSystemTheme());
    }
  });

  // 当 isDarkMode 变化时应用主题
  watch(isDarkMode, (newValue) => {
    applyTheme(newValue ? 'dark' : 'light');
  });

  return {
    isDarkMode,
    toggleDarkMode
  };
}
</script>
