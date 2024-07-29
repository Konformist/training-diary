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
import TagModel from 'src/core/entities/tag/TagModel';
import { ITagStruct } from 'src/core/entities/tag/TagStruct';
import { TrainingExerciseStruct } from 'src/core/entities/training-exercise/TrainingExerciseStruct';
import TrainingExerciseModel from 'src/core/entities/training-exercise/TrainingExerciseModel';
import TrainingModel from 'src/core/entities/training/TrainingModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';
// eslint-disable-next-line import/no-relative-packages
import { Directory, Filesystem, Encoding } from '../../src-capacitor/node_modules/@capacitor/filesystem';

export interface IStorageTraining {
  version: number
  muscles: IMuscleStruct[]
  equipments: IEquipmentStruct[]
  exercises: IExerciseStruct[]
  tags: ITagStruct[]
  trainings: ITrainingStruct[]
  trainingExercises: TrainingExerciseStruct[]
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
      tags: [] as TagModel[],
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
        tags: this.tags.map((e) => e.getStruct()),
        trainings: this.trainings.map((e) => e.getStruct()),
        trainingExercises: this.trainingExercises.map((e) => e.getStruct()),
      };
    },
  },

  actions: {
    setSavedData(value: Partial<IStorageTraining>) {
      this.version = value.version || VERSION_DB;
      this.muscles = (value.muscles || []).map((e) => new MuscleModel(e));
      this.equipments = (value.equipments || []).map((e) => new EquipmentModel(e));
      this.exercises = (value.exercises || []).map((e) => new ExerciseModel(e));
      this.tags = (value.tags || []).map((e) => new TagModel(e));
      this.trainings = (value.trainings || []).map((e) => new TrainingModel(e));
      this.trainingExercises = (value.trainingExercises || []).map((e) => new TrainingExerciseModel(e));
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

    addTag() {
      const newItem = new TagModel();
      const ids = this.tags.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      this.tags.push(newItem);
      return newItem.id;
    },

    delTag(id: number) {
      this.tags = this.tags.filter((e) => e.id !== id);
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
      this.trainingExercises = this.trainingExercises.filter((e) => e.training_id !== id);
    },

    copyTraining(id: number) {
      const newItem = new TrainingModel(this.trainings.find((e) => e.id === id)?.getStruct());
      const ids = this.trainings.map((e) => e.id);

      newItem.id = Math.max(...ids, 0) + 1;
      newItem.date = (new Date()).getTime();
      this.trainings.push(newItem);

      this.trainingExercises
        .filter((e) => e.training_id === id)
        .forEach((e) => {
          this.addTrainingExercise(newItem.id, e.exercise_id);
        });

      return newItem.id;
    },

    addTrainingExercise(trainingId: number, exerciseId: number = 0) {
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
      this.trainingExercises.forEach((e) => {
        if (e.bind_prev === id) e.bind_prev = 0;
        if (e.bind_next === id) e.bind_next = 0;
      });
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
        Notify.create({ color: 'negative', caption: 'Не удалось сохранить данные', timeout: 1000 });
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
