// main.js
import './main.css';

import { createApp } from 'vue';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'; // 已包含 'info-circle' 和 'times'
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab); // fas 包含所有 free solid 图标

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
