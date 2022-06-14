<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
  window.location.reload()
}

</script>

<template>
  <n-card v-if="offlineReady || needRefresh" role="alert"
    style="width: 300px; height: auto; position: fixed; right: 15px; bottom: 15px;">
    <div role="alert">
      <div class="mb-3">
        <span v-if="offlineReady">App ready to work offline</span>
        <span v-else>New content available, click on reload button to update.</span>
      </div>
      <n-button size="small" v-if="needRefresh" @click="updateServiceWorker()">Reload</n-button>
      <n-button size="small" @click="close">Close</n-button>
    </div>
  </n-card>
</template>