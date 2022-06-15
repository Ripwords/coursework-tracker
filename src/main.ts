import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'
import App from './App.vue'
import 'virtual:windi.css'

const firebaseConfig = {
  apiKey: "AIzaSyDavFBEgkJN4cI37kPx5dPYncbM1hURCbI",
  authDomain: "cw-tracker-28b2c.firebaseapp.com",
  projectId: "cw-tracker-28b2c",
  storageBucket: "cw-tracker-28b2c.appspot.com",
  messagingSenderId: "469531488170",
  appId: "1:469531488170:web:a7d02f81193c5b440785d3"
}

initializeApp(firebaseConfig);

const pinia = createPinia()
createApp(App)
  .use(pinia)
  .mount('#app')
