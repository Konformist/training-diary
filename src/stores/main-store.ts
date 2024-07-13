import { defineStore } from 'pinia';
import { date, Notify } from 'quasar';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import { StoreNames, VERSION_DB } from 'src/core/dictionaries/storeNames';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

export interface IStorageTraining {
  version: number
  trainings: ITrainingStruct[]
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
      trainings: [] as TrainingModel[],
      selectDate: date.formatDate(new Date(), DATE_MASK),
    };
  },
  getters: {
    trainingDates(): number[] {
      return [...new Set(this.trainings.map((e) => e.date))];
    },

    savedData(): IStorageTraining {
      return {
        version: this.version,
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
    async migrationDB() {
      if (VERSION_DB > this.version) {
        this.version = VERSION_DB;
        this.trainings.forEach((training, index) => {
          training.id = index + 1;
          training.exercises.forEach((exercise, i) => {
            exercise.id = i + 1;
          });
        });

        await this.saveTrainings();
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

        this.version = parsed.version;
        this.trainings = parsed.trainings.map((e) => new TrainingModel(e));
      } catch (e) {
        this.saveTrainings();
      }
    },
  },
});
