import { defineStore } from 'pinia';
import { LocalStorage, Notify } from 'quasar';
import { StoreNames } from 'src/core/dictionaries/storeNames';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

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
  getters: {
    savedData(): IStorageTraining {
      return {
        version: 1,
        trainings: this.trainings.map((e) => e.getStruct()),
      };
    },
  },
  actions: {
    async migrationDB() {
      const result = LocalStorage.getItem<IStorageTraining>('TRAININGS');

      if (result) {
        this.loadTrainingsWeb();
        await this.saveTrainings();
        LocalStorage.removeItem('TRAININGS');
      }
    },

    async saveTrainings() {
      try {
        await Filesystem.writeFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          recursive: true,
          encoding: Encoding.UTF8,
          data: JSON.stringify(this.savedData),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        Notify.create({
          caption: 'Не удалось сохранить данные',
          message: e,
          type: 'negative',
        });
      }
    },

    loadTrainingsWeb() {
      const result = LocalStorage.getItem<IStorageTraining>(StoreNames.TRAININGS);

      this.trainings = (result?.trainings || []).map((e) => new TrainingModel(e));
    },

    async loadTrainings() {
      try {
        const result = await Filesystem.readFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          encoding: Encoding.UTF8,
        });

        this.trainings = (JSON.parse(result.data as string) as IStorageTraining).trainings
          .map((e) => new TrainingModel(e));
      } catch (e) {
        this.saveTrainings();
      }
    },
  },
});
