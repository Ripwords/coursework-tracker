<script lang="ts" setup>
import { useLoadingBar } from 'naive-ui'

const loading = useLoadingBar()
loading.start()

onUnmounted(() => {
  loading.finish()
})
</script>

<template>
  <div></div>
</template>