<script lang="ts" setup>
import { useNotification } from 'naive-ui'
import { Auth, getAuth, getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth'
import { store } from '../store'

let auth: Auth
const pinia = store()
const notification = useNotification()
const props = defineProps(["theme"])
const emits = defineEmits(["themeChange", "signedOut", "signedIn"])

const logout = () => {
  signOut(auth).then(() => {
    notification['success']({
      content: 'Signed out!',
      duration: 3000,
    })
    emits("signedOut")
  })
}

onMounted(() => {
  auth = getAuth()
  if (auth.currentUser) {
    pinia.user = auth.currentUser
  }
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        pinia.user = result.user
        emits("signedIn")
        notification['success']({
          content: 'Signed in!',
          duration: 3000,
        })
      }
    })
  onAuthStateChanged(auth, user => {
    if (user) {
      pinia.user = user
    } else {
      pinia.user = {}
    }
  })

})
</script>

<template>
  <div class="mt-2 flex justify-center">
    <div class="max-w-600px flex justify-around">
      <n-button @click="emits('themeChange')">
        <i-ic:round-light-mode v-if="!props.theme" />
        <i-ic:round-dark-mode v-else />
      </n-button>
      <div class="mx-15">
        <n-h2>
          Coursework Tracker
        </n-h2>
      </div>
      <n-button @click="logout" :disabled="Object.keys(pinia.user).length == 0">
        <i-ic:round-logout />
      </n-button>
    </div>
  </div>
  <div class="fixed left-3 bottom-0">
    <n-h6>
      {{ pinia.user.email }}
    </n-h6>
  </div>
  <div class="fixed right-3 bottom-3">
    <a href="https://github.com/Ripwords/coursework-tracker" target="_blank">
      <i-mdi:github style="font-size: 35px;" />
    </a>
  </div>
</template>