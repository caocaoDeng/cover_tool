import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('userInfoState', () => {
  const userInfo = ref({})

  return { userInfo }
})
