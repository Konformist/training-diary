import { defineStore } from 'pinia'

const useTrainingsPageStore = defineStore('trainingsPage', {
  state: () => ({
    options: {
      tagId: 0,
    },
  }),
})

export default useTrainingsPageStore
