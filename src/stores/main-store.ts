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

export interface ICombo {
  label: string
  value: string
}

export interface IComboExercise extends ICombo {
  muscle_group: string
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

    combos(): { muscle_group: ICombo[], exercises: IComboExercise[] } {
      const muscleGroup = [
        { label: 'Грудь', value: 'Грудь' },
        { label: 'Спина', value: 'Спина' },
        { label: 'Бицепс', value: 'Бицепс' },
        { label: 'Трицепс', value: 'Трицепс' },
        { label: 'Пресс', value: 'Пресс' },
        { label: 'Ноги', value: 'Ноги' },
      ];

      const exercises = [...this.trainings
        .reduce((acc, training) => {
          training.exercises.forEach((exercise) => {
            acc.set(exercise.name, {
              label: exercise.name,
              value: exercise.name,
              muscle_group: exercise.muscle_group,
            });
          });

          return acc;
        }, new Map<string, IComboExercise>())
        .values()];

      return {
        muscle_group: muscleGroup,
        exercises,
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
      if (VERSION_DB > this.version) {
        this.muscles = [
          new MuscleModel({ id: 1, name: 'Грудь' }),
          new MuscleModel({ id: 2, name: 'Спина' }),
          new MuscleModel({ id: 3, name: 'Бицепс' }),
          new MuscleModel({ id: 4, name: 'Трицепс' }),
          new MuscleModel({ id: 5, name: 'Пресс' }),
          new MuscleModel({ id: 6, name: 'Ноги' }),
        ];

        let index = 1;

        this.exercises = [...this.trainings
          .reduce((acc, training) => {
            training.exercises.forEach((item) => {
              if (acc.has(item.name)) {
                return;
              }

              const exercise = new ExerciseModel();

              exercise.id = index++;
              exercise.name = item.name;
              exercise.muscle_group_id = this.muscles.find((e) => e.name === item.muscle_group)?.id || 0;

              acc.set(exercise.name, exercise);
            });

            return acc;
          }, new Map<string, ExerciseModel>())
          .values()];

        this.trainings.forEach((training) => {
          training.exercises.forEach((item) => {
            item.exercise_id = this.exercises.find((e) => e.name === item.name)?.id || 0;
            item.name = '';
            item.muscle_group = '';
          });
        });

        this.version = VERSION_DB;
        await this.saveTrainings();
      }
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
