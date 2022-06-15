import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export  const store = defineStore('store', {
  state: () => ({
    user: {} as any,
    data: useStorage('data', [] as {
      name: string,
      cw: any
    }[]),
    scale: {
      Ap: 90,
      A: 80,
      Am: 75,
      Bp: 70,
      B: 65,
      Bm: 60,
      Cp: 55,
      C: 50,
      D: 40
    }
  })
})