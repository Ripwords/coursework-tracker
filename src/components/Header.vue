<script lang="ts" setup>
import { useNotification, useLoadingBar } from 'naive-ui'
import { Auth, getAuth, getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth'
import { store } from '../store'
import { hydratePiniaFromFirestore, unsub } from '../functions'

let auth: Auth
const pinia = store()
const notification = useNotification()
const props = defineProps(["theme"])
const emits = defineEmits(["themeChange", "signedOut", "signedIn", "spinStart", "spinEnd"])

const logout = () => {
  signOut(auth).then(() => {
    notification['success']({
      content: 'Signed out!',
      duration: 3000,
    })
    pinia.data = []
    pinia.user = {}
    emits("signedOut")
  })
}

onMounted(() => {
  auth = getAuth()
  getRedirectResult(auth)
    .then(async (result) => {
      if (result?.user) {
        emits("signedIn")
        notification['success']({
          content: 'Signed in!',
          duration: 3000,
        })
      }
    })
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      emits("spinStart")
      pinia.user = user
      await hydratePiniaFromFirestore(pinia)
      emits("spinEnd")
      unsub(pinia)
    } else {
      pinia.user = {}
    }
  })
})
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-600px flex justify-around items-center">
      <n-button @click="emits('themeChange')">
        <i-ic:round-light-mode v-if="!props.theme" />
        <i-ic:round-dark-mode v-else />
      </n-button>
      <n-h2 class="mx-15 text-center">
        Coursework Tracker
      </n-h2>
      <n-tooltip>
        <template #trigger>
          <n-button @click="logout" :disabled="Object.keys(pinia.user).length == 0">
            <i-ic:round-logout />
          </n-button>
        </template>
        <div v-if="Object.keys(pinia.user).length != 0">
          Logout of {{ pinia.user.email?.split("@")[0] }}?
        </div>
      </n-tooltip>
    </div>
  </div>
  <div class="fixed left-4 bottom-0">
    <n-h6>
      {{ pinia.user.email?.split("@")[0] }}
    </n-h6>
  </div>
  <div class="fixed right-4 bottom-3">
    <a href="https://github.com/Ripwords/coursework-tracker" target="_blank">
      <i-mdi:github style="font-size: 35px;" />
    </a>
  </div>
</template>