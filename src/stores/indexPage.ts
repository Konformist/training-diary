import { defineStore } from 'pinia'

const useIndexPageStore = defineStore('indexPage', {
  state: () => ({
    selectDate: new Date(),
  }),
})

export default useIndexPageStore
