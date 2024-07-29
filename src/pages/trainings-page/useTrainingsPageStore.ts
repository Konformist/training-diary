import { defineStore } from 'pinia';

const useTrainingsPageStore = defineStore('trainingsPage', {
  state() {
    return {
      scroll: 0,
      options: {
        tagId: 0,
      },
    };
  },
});

export default useTrainingsPageStore;
