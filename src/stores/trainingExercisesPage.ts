import { defineStore } from 'pinia'

const useTrainingExercisesPageStore = defineStore('trainingExercisesPage', {
  state: () => ({
    options: {
      tagId: 0,
      exerciseId: 0,
    },
  }),
})

export default useTrainingExercisesPageStore
