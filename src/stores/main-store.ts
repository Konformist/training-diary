import { defineStore } from 'pinia';
import {
  Dark, date as qDate, LocalStorage, Notify,
} from 'quasar';
import { DATE_MASK } from 'src/core/dictionaries/dates';
import { StoreNames, VERSION_DB } from 'src/core/dictionaries/storeNames';
import EquipmentModel from 'src/core/entities/equipment/EquipmentModel';
import { IEquipmentStruct } from 'src/core/entities/equipment/EquipmentStruct';
import ExerciseModel from 'src/core/entities/exercise/ExerciseModel';
import { IExerciseStruct } from 'src/core/entities/exercise/ExerciseStruct';
import MuscleModel from 'src/core/entities/muscle/MuscleModel';
import { IMuscleStruct } from 'src/core/entities/muscle/MuscleStruct';
import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingExerciseStruct, ITrainingStruct } from 'src/core/entities/training/TrainingStruct';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

export interface IStorageTraining {
  version: number
  muscles: IMuscleStruct[]
  equipments: IEquipmentStruct[]
  exercises: IExerciseStruct[]
  trainings: ITrainingStruct[]
  trainingExercises: ITrainingExerciseStruct[]
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

      equipments: [] as EquipmentModel[],
      muscles: [] as MuscleModel[],
      exercises: [] as ExerciseModel[],
      trainings: [] as TrainingModel[],
      trainingExercises: [] as TrainingExerciseModel[],

      selectDate: qDate.formatDate(new Date(), DATE_MASK),
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
        equipments: this.equipments.map((e) => e.getStruct()),
        exercises: this.exercises.map((e) => e.getStruct()),
        trainings: this.trainings.map((e) => e.getStruct()),
        trainingExercises: this.trainingExercises.map((e) => e.getStruct()),
      };
    },
  },

  actions: {
    setSavedData(value: IStorageTraining) {
      this.version = value.version;
      this.muscles = (value.muscles || []).map((e) => new MuscleModel(e));
      this.equipments = (value.equipments || []).map((e) => new EquipmentModel(e));
      this.exercises = (value.exercises || []).map((e) => new ExerciseModel(e));
      this.trainings = (value.trainings || []).map((e) => new TrainingModel(e));
      this.trainingExercises = (value.trainingExercises || []).map((e) => new TrainingExerciseModel(e));
    },

    async migrationDB() {
      // empty
      if (!this.trainingExercises.length) {
        let index = 1;

        this.trainings.forEach((training) => {
          if (!training.exercises) return;

          training.exercises
            .map((e) => new TrainingExerciseModel(e.getStruct()))
            .forEach((exercise, _, array) => {
              const curId = exercise.id;

              exercise.id = index++;
              exercise.training_id = training.id;

              array.forEach((e) => {
                if (e.bind_prev === curId) e.bind_prev = exercise.id;
                if (e.bind_next === curId) e.bind_next = exercise.id;
              });

              this.trainingExercises.push(exercise);
            });

          delete training.exercises;
        });
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

    addMuscle() {
      const newItem = new MuscleModel();
      const ids = this.muscles.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      this.muscles.push(newItem);
      return newItem.id;
    },

    delMuscle(id: number) {
      this.muscles = this.muscles.filter((e) => e.id !== id);
    },

    addEquipment() {
      const newItem = new EquipmentModel();
      const ids = this.equipments.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      this.equipments.push(newItem);
      return newItem.id;
    },

    delEquipment(id: number) {
      this.equipments = this.equipments.filter((e) => e.id !== id);
    },

    addExercise(name?: string) {
      const newItem = new ExerciseModel();
      const ids = this.exercises.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      newItem.name = name || '';
      this.exercises.push(newItem);
      return newItem.id;
    },

    delExercise(id: number) {
      this.exercises = this.exercises.filter((e) => e.id !== id);
    },

    addTraining(date?: Date) {
      const newItem = new TrainingModel();
      const ids = this.trainings.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      newItem.date = (date || new Date()).getTime();
      this.trainings.push(newItem);
      return newItem.id;
    },

    delTraining(id: number) {
      this.trainings = this.trainings.filter((e) => e.id !== id);
    },

    addTrainingExercise(trainingId: number, exerciseId: number) {
      const newItem = new TrainingExerciseModel();
      const ids = this.trainingExercises.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      newItem.training_id = trainingId;
      newItem.exercise_id = exerciseId;
      this.trainingExercises.push(newItem);
      return newItem.id;
    },

    delTrainingExercise(id: number) {
      this.trainingExercises = this.trainingExercises.filter((e) => e.id !== id);
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
        Notify.create({ type: 'negative', caption: 'Не удалось сохранить данные' });
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
