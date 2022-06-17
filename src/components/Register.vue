<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'
import { useLoadingBar, useNotification } from 'naive-ui'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { signInGoogle, errorHandler } from '../functions'

const emits = defineEmits(["signInSuccess", "login"])
const loadingBar = useLoadingBar()
const notification = useNotification()

const email = ref("")
const password = ref("")
const passwordConfirm = ref("")
const loading = ref(false)
const { enter } = useMagicKeys()

const reset = () => {
  email.value = ""
  password.value = ""
  passwordConfirm.value = ""
  if (loading.value) {
    loading.value = false
    loadingBar.finish()
  }
}

const verifyEmail = async (user: any) => {
  await sendEmailVerification(user, {
    url: import.meta.env.PROD ? 'https://cw-tracker.netlify.app/' : 'http://localhost:3000/'
  })
}

const register = async () => {
  if (email.value == '' || password.value == '' || passwordConfirm.value == '') {
    notification['warning']({
      content: 'Please fill in all fields',
      duration: 3000,
    })
  } else if (password.value !== passwordConfirm.value) {
    notification['warning']({
      content: 'Passwords do not match',
      duration: 3000,
    })
  } else {
    try {
      loading.value = true
      const created = await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      if (getAuth().currentUser && created) {
        await verifyEmail(getAuth().currentUser)
        notification['success']({
          content: 'Account created!',
          meta: 'Verify your email, and check your spam folder!',
          duration: 3000,
        })
      } else {
        return
      }
    } catch (error: any) {
      loading.value = false
      loadingBar.finish()
      errorHandler(error.code)
      notification['warning']({
        content: error.code,
        duration: 3000,
      })
    }
    reset()
  }
}

watch(enter, (v) => {
  if (v) {
    if (email.value && password.value) {
      register()
    }
  }
})
</script>

<template>
  <div class="flex justify-center">
    <n-card class="max-w-[500px] mt-3">
      <div class="flex justify-center">
        <n-h3>
          Register
        </n-h3>
      </div>
      <div class="flex justify-center">
        <n-input v-model:value="email" placeholder="Email" type="email" class="mt-3" />
      </div>
      <div class="flex justify-center">
        <n-input type="password" show-password-on="mousedown" placeholder="Password" v-model:value="password" />
      </div>
      <div class="flex justify-center">
        <n-input type="password" show-password-on="mousedown" placeholder="Confirm Password"
          v-model:value="passwordConfirm" />
      </div>
      <div class="flex justify-center">
        <n-button class="mt-3" @click="register" :disabled="!email || !password">
          Register
        </n-button>
        <n-button class="mt-3" @click="signInGoogle()">
          <i-carbon:logo-google />
        </n-button>
      </div>
      <div class="flex justify-end mt-3 text-size-[12px]">
        <p>Already have an account?
          <button @click="reset(); emits('login')"><a class="blue">Login here</a></button>
        </p>
      </div>
    </n-card>
  </div>
</template>