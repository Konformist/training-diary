/* eslint-disable no-console */
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { StoreNames } from 'src/core/dictionaries/storeNames';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';

export interface IStorageTraining {
  version: number
  trainings: ITrainingStruct[]
}

export const useMainStore = defineStore('main', {
  state() {
    return {
      currentTraining: null as TrainingModel|null,
      trainings: [] as TrainingModel[],
    };
  },
  actions: {
    loadTrainings() {
      const result = LocalStorage.getItem<IStorageTraining>(StoreNames.TRAININGS);

      this.trainings = (result?.trainings || []).map((e) => new TrainingModel(e));
    },

    saveTrainings() {
      LocalStorage.setItem(StoreNames.TRAININGS, {
        version: 1,
        trainings: this.trainings.map((e) => e.getStruct()),
      });
    },
  },
});
