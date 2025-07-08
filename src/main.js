import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/style.css'; // Import your custom styles

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');