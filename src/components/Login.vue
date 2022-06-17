<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'
import { useLoadingBar, useNotification } from 'naive-ui'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { signInGoogle, errorHandler } from '../functions'
import { store } from '../store'

const pinia = store()
const emits = defineEmits(["signedIn", "register", "forgot"])
const loadingBar = useLoadingBar()
const notification = useNotification()

const email = ref("")
const password = ref("")
const { enter } = useMagicKeys()

const reset = () => {
  email.value = ""
  password.value = ""
}

const signIn = async () => {
  loadingBar.start()
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(async () => {
      reset()
      loadingBar.finish()
      emits("signedIn")
      notification['success']({
        content: 'Signed in!',
        duration: 3000,
      })
      pinia.user = getAuth().currentUser
    })
    .catch(error => {
      reset()
      loadingBar.error()
      pinia.user = {}
      errorHandler(error.code)
      notification['warning']({
        content: error.code,
        duration: 3000,
      })
    })
}

watch(enter, (v) => {
  if (v) {
    if (email.value && password.value) {
      signIn()
    }
  }
})
</script>

<template>
  <div class="flex justify-center">
    <n-card class="max-w-[500px] mt-3">
      <div class="flex justify-center">
        <n-h3>
          Sign In
        </n-h3>
      </div>
      <div class="flex justify-center">
        <n-input v-model:value="email" placeholder="Email" type="email" class="mt-3" />
      </div>
      <div class="flex justify-center">
        <n-input type="password" show-password-on="mousedown" placeholder="Password" v-model:value="password" />
      </div>
      <div class="flex justify-center">
        <n-button class="mt-3" @click="signIn" :disabled="!email || !password">
          Sign In
        </n-button>
        <n-button class="mt-3" @click="signInGoogle">
          <i-carbon:logo-google />
        </n-button>
      </div>
      <div class="flex justify-end mt-3 text-size-[12px]">
        <p>Don't have an account?
          <button @click="emits('register')"><a class="blue">Register here</a></button>
        </p>
      </div>
      <div class="flex justify-end mt-3 text-size-[12px]">
        <p>
          <button @click="emits('forgot')"><a class="blue">Forgot password?</a></button>
        </p>
      </div>
    </n-card>
  </div>
</template>