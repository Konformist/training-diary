import { defineStore } from 'pinia';
import {
  Dark, date, LocalStorage, Notify,
} from 'quasar';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import { StoreNames, VERSION_DB } from 'src/core/dictionaries/storeNames';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { IExerciseStruct } from 'src/core/entities/exercise/ExerciseStruct';
import MuscleModel from 'src/core/entities/muscle/MuscleModel';
import { IMuscleStruct } from 'src/core/entities/muscle/MuscleStruct';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

export interface IStorageTraining {
  version: number
  muscles: IMuscleStruct[]
  exercises: IExerciseStruct[]
  trainings: ITrainingStruct[]
}

export interface IStorageSettings {
  version: number
  darkMode: boolean|'auto'
}

export const useMainStore = defineStore('main', {
  state() {
    return {
      version: VERSION_DB,
      darkMode: 'auto' as boolean|'auto',

      muscles: [
        new MuscleModel({ id: 1, name: 'Грудь' }),
        new MuscleModel({ id: 2, name: 'Спина' }),
        new MuscleModel({ id: 3, name: 'Бицепс' }),
        new MuscleModel({ id: 4, name: 'Трицепс' }),
        new MuscleModel({ id: 5, name: 'Пресс' }),
        new MuscleModel({ id: 6, name: 'Ноги' }),
        new MuscleModel({ id: 7, name: 'Плечи' }),
      ] as MuscleModel[],
      exercises: [] as ExerciseModel[],
      trainings: [] as TrainingModel[],

      selectDate: date.formatDate(new Date(), DATE_MASK),
    };
  },
  getters: {
    trainingDates(): number[] {
      return [...new Set(this.trainings.map((e) => e.date))];
    },

    savedOptions(): IStorageSettings {
      return {
        version: this.version,
        darkMode: this.darkMode,
      };
    },

    savedData(): IStorageTraining {
      return {
        version: this.version,
        muscles: this.muscles.map((e) => e.getStruct()),
        exercises: this.exercises.map((e) => e.getStruct()),
        trainings: this.trainings.map((e) => e.getStruct()),
      };
    },
  },
  actions: {
    setSavedData(value: IStorageTraining) {
      this.version = value.version;
      this.muscles = (value.muscles || []).map((e) => new MuscleModel(e));
      this.exercises = (value.exercises || []).map((e) => new ExerciseModel(e));
      this.trainings = (value.trainings || []).map((e) => new TrainingModel(e));
    },

    async migrationDB() {
      // empty
    },

    saveSettings() {
      LocalStorage.setItem(StoreNames.SETTINGS, this.savedOptions);
    },

    loadSettings() {
      const result = LocalStorage.getItem<IStorageSettings>(StoreNames.SETTINGS);

      if (result) {
        this.darkMode = result.darkMode;
        Dark.set(this.darkMode);
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

    async loadTrainings() {
      try {
        const result = await Filesystem.readFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          encoding: Encoding.UTF8,
        });
        const parsed = (JSON.parse(result.data as string) as IStorageTraining);

        this.setSavedData(parsed);
      } catch (e) {
        this.saveTrainings();
      }
    },
  },
});
