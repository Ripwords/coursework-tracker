import { defineStore } from 'pinia'

export  const store = defineStore('store', {
  state: () => ({
    user: {} as any,
    data: [] as {
      name: string,
      target: string,
      cw: any
    }[],
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