import { defineStore } from 'pinia';
import { LocalStorage, Notify, Platform } from 'quasar';
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
      if (Platform.is.capacitor) {
        const result = LocalStorage.getItem<IStorageTraining>('TRAININGS');

        if (result) {
          this.loadTrainingsWeb();
          await this.saveTrainingFile();
          LocalStorage.removeItem('TRAININGS');
        }
      }
    },

    saveTrainingsWeb() {
      LocalStorage.setItem(StoreNames.TRAININGS, this.savedData);
    },

    async saveTrainingFile() {
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

    async saveTrainings() {
      if (Platform.is.capacitor) {
        await this.saveTrainingFile();
      } else {
        this.saveTrainingsWeb();
      }
    },

    loadTrainingsWeb() {
      const result = LocalStorage.getItem<IStorageTraining>(StoreNames.TRAININGS);

      this.trainings = (result?.trainings || []).map((e) => new TrainingModel(e));
    },

    async loadTrainingsFile() {
      try {
        const result = await Filesystem.readFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          encoding: Encoding.UTF8,
        });

        this.trainings = (JSON.parse(result.data as string) as IStorageTraining).trainings
          .map((e) => new TrainingModel(e));
      } catch (e) {
        this.saveTrainingFile();
      }
    },

    async loadTrainings() {
      if (Platform.is.capacitor) {
        await this.loadTrainingsFile();
      } else {
        this.loadTrainingsWeb();
      }
    },
  },
});
