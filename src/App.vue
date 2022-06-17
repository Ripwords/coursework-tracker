<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
import { store } from './store'

const pinia = store()
const page = ref('login')
const spinner = ref(false)
pinia.user = {}


const theme = ref<any>(darkTheme)
const toggleTheme = () => {
  theme.value = theme.value ? null : darkTheme
}

watch(() => pinia.user, () => {
  page.value = Object.keys(pinia.user).length > 0 ? 'tracker' : 'login'
})
</script>

<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-notification-provider>
        <Header :theme="theme" @themeChange="toggleTheme" @signedIn="page='tracker'" @signedOut="page='login'"
          @spinStart="spinner=true" @spinEnd="spinner=false" />
        <Login v-if="page == 'login'" @signedIn="page='tracker'" @register="page='register'" @forgot="page='forgot'" />
        <Register v-else-if="page == 'register'" @login="page='login'" />
        <div v-else-if="page == 'tracker'">
          <div v-if="spinner" class="flex justify-center items-center">
            <n-spin size="large" />
          </div>
          <Tracker v-else />
        </div>
        <Forgot v-else @login="page='login'" />
      </n-notification-provider>
    </n-loading-bar-provider>
    <ReloadPrompt />
    <n-global-style />
  </n-config-provider>
</template>

<style>



/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
input {
  font-size: 16px !important;
}

.blue {
  color: #346ed3 !important;
}
</style>