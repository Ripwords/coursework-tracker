<script lang="ts" setup>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useNotification } from 'naive-ui'
import { errorHandler } from '../functions'

const notification = useNotification()
const email = ref("")
const emits = defineEmits(["login"])

const forgotPassword = async () => {
  if (email.value) {
    sendPasswordResetEmail(getAuth(), email.value)
      .then(() => {
        notification['success']({
          content: 'Password reset email sent!',
          duration: 3000,
        })
      })
      .catch(error => {
        errorHandler(error.code)
        notification['warning']({
          content: error.code,
          duration: 3000,
        })
      })
  } else {
    notification['warning']({
      content: 'Please enter an email',
      duration: 3000,
    })
  }
}
</script>

<template>
  <div class="flex justify-center">
    <n-card class="max-w-[500px] mt-3">
      <div class="flex justify-center">
        <n-h3>
          Forgot Password
        </n-h3>
      </div>
      <div class="flex justify-center">
        <n-input v-model:value="email" placeholder="Email" type="email" class="mt-3" />
      </div>
      <div class="flex justify-center">
        <n-button @click="forgotPassword" class="mt-3">
          Reset Email
        </n-button>
        <n-button @click="emits('login')" class="mt-3">
          Back
        </n-button>
      </div>
    </n-card>
  </div>
</template>