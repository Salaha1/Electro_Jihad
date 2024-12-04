import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Axios global configuration
axios.defaults.withCredentials = true; // Ensures cookies are included
axios.defaults.baseURL = 'http://localhost:5000'; // Adjust for your backend URL

createApp(App)
  .use(router)  
  .mount('#app');