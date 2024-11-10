import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import './registerServiceWorker'

loadFonts();

let deferredPrompt; // Declare the variable here

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event; // Assign the event to deferredPrompt
});

createApp(App)
  .use(vuetify)
  .provide('deferredPrompt', deferredPrompt) // Provide it to Vue components
  .mount('#app');
