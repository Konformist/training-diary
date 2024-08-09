// Utilities
import { StoreNames, VERSION_DB } from '@/core/dictionaries/storeNames'
import EquipmentModel from '@/core/entities/equipment/EquipmentModel'
import { IEquipmentStruct } from '@/core/entities/equipment/EquipmentStruct'
import ExerciseModel from '@/core/entities/exercise/ExerciseModel'
import { IExerciseStruct } from '@/core/entities/exercise/ExerciseStruct'
import MuscleModel from '@/core/entities/muscle/MuscleModel'
import { IMuscleStruct } from '@/core/entities/muscle/MuscleStruct'
import TagModel from '@/core/entities/tag/TagModel'
import { ITagStruct } from '@/core/entities/tag/TagStruct'
import TrainingExerciseModel from '@/core/entities/training-exercise/TrainingExerciseModel'
import { ITrainingExerciseStruct } from '@/core/entities/training-exercise/ITrainingExerciseStruct'
import TrainingModel from '@/core/entities/training/TrainingModel'
import { ITrainingStruct } from '@/core/entities/training/TrainingStruct'
import { firstLetterUp } from '@/core/utils/strings'
import { App } from '@capacitor/app'
import { CapacitorHttp } from '@capacitor/core'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { Device } from '@capacitor/device'
import { defineStore } from 'pinia'
import { name, version } from '../../package.json'

const productName = name.split('-').map(e => firstLetterUp(e)).join('')

export interface IStorageTraining {
  version: number
  muscles: IMuscleStruct[]
  equipments: IEquipmentStruct[]
  exercises: IExerciseStruct[]
  tags: ITagStruct[]
  trainings: ITrainingStruct[]
  trainingExercises: ITrainingExerciseStruct[]
}

export type TThemes = 'dark'|'light'

export interface IStorageSettings {
  version: number
  darkMode: TThemes
}

export interface IToast {
  text: string
  color?: string
  closeDelay?: number
}

export const useAppStore = defineStore('app', {
  state: () => ({
    appInfo: {
      name: productName,
      frontVersion: version,
      platform: '',
      platformAppVersion: '',
    },

    toasts: [] as Array<string|IToast>,

    version: VERSION_DB,
    darkMode: 'dark' as TThemes,

    equipments: [] as EquipmentModel[],
    muscles: [] as MuscleModel[],
    exercises: [] as ExerciseModel[],
    tags: [] as TagModel[],
    trainings: [] as TrainingModel[],
    trainingExercises: [] as TrainingExerciseModel[],

    selectDate: new Date(),
  }),

  getters: {
    trainingDates (): number[] {
      return [...new Set(this.trainings.map(e => e.date))]
    },

    savedOptions (): IStorageSettings {
      return {
        version: this.version,
        darkMode: this.darkMode,
      }
    },

    savedData (): IStorageTraining {
      return {
        version: this.version,
        muscles: this.muscles.map(e => e.getStruct()),
        equipments: this.equipments.map(e => e.getStruct()),
        exercises: this.exercises.map(e => e.getStruct()),
        tags: this.tags.map(e => e.getStruct()),
        trainings: this.trainings.map(e => e.getStruct()),
        trainingExercises: this.trainingExercises.map(e => e.getStruct()),
      }
    },
  },

  actions: {
    addToast (value: string|IToast) {
      this.toasts.push(value)
    },

    async getPlatformInfo () {
      const device = await Device.getInfo()

      this.appInfo.platform = device.platform

      if (device.platform !== 'web') {
        const info = await App.getInfo()
        this.appInfo.platformAppVersion = info.version
      }
    },

    async checkVersion () {
      const result = await CapacitorHttp.get({ url: 'https://api.github.com/repos/Konformist/training-diary/releases/latest' })

      return result.data.tag_name !== `v${this.appInfo.frontVersion}`
        ? result.data.assets[0].browser_download_url
        : ''
    },

    setSavedData (value: Partial<IStorageTraining>) {
      this.version = value.version || VERSION_DB
      this.muscles = (value.muscles || []).map(e => new MuscleModel(e))
      this.equipments = (value.equipments || []).map(e => new EquipmentModel(e))
      this.exercises = (value.exercises || []).map(e => new ExerciseModel(e))
      this.tags = (value.tags || []).map(e => new TagModel(e))
      this.trainingExercises = (value.trainingExercises || []).map(e => new TrainingExerciseModel(e))
      this.trainings = (value.trainings || []).map(e => new TrainingModel(e))
    },

    async migrationDB () {
      // empty
    },

    async saveSettings () {
      await Preferences.set({ key: StoreNames.SETTINGS, value: JSON.stringify(this.savedOptions) })
    },

    async loadSettings () {
      const result = await Preferences.get({ key: StoreNames.SETTINGS })

      if (result.value) {
        const dataParsed = JSON.parse(result.value)
        this.darkMode = dataParsed.darkMode
      }
    },

    addMuscle () {
      const newItem = new MuscleModel()
      const ids = this.muscles.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      this.muscles.push(newItem)
      return newItem.id
    },

    delMuscle (id: number) {
      this.muscles = this.muscles.filter(e => e.id !== id)
    },

    addEquipment () {
      const newItem = new EquipmentModel()
      const ids = this.equipments.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      this.equipments.push(newItem)
      return newItem.id
    },

    delEquipment (id: number) {
      this.equipments = this.equipments.filter(e => e.id !== id)
    },

    addExercise (name?: string) {
      const newItem = new ExerciseModel()
      const ids = this.exercises.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      newItem.name = name || ''
      this.exercises.push(newItem)
      return newItem.id
    },

    delExercise (id: number) {
      this.exercises = this.exercises.filter(e => e.id !== id)
    },

    addTag () {
      const newItem = new TagModel()
      const ids = this.tags.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      this.tags.push(newItem)
      return newItem.id
    },

    delTag (id: number) {
      this.tags = this.tags.filter(e => e.id !== id)
    },

    addTraining (date?: Date) {
      const newItem = new TrainingModel()
      const ids = this.trainings.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      newItem.date = (date || new Date()).getTime()
      this.trainings.push(newItem)
      return newItem.id
    },

    delTraining (id: number) {
      this.trainings = this.trainings.filter(e => e.id !== id)
      this.trainingExercises = this.trainingExercises.filter(e => e.training_id !== id)
    },

    copyTraining (id: number) {
      const newItem = new TrainingModel(this.trainings.find(e => e.id === id)?.getStruct())
      const ids = this.trainings.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      this.trainings.push(newItem)

      this.trainingExercises
        .filter(e => e.training_id === id)
        .forEach(e => {
          this.addTrainingExercise(newItem.id, e.exercise_id)
        })

      return newItem.id
    },

    addTrainingExercise (trainingId: number, exerciseId: number = 0) {
      const newItem = new TrainingExerciseModel()
      const ids = this.trainingExercises.map(e => e.id)

      newItem.id = Math.max(...ids, 0) + 1
      newItem.training_id = trainingId
      newItem.exercise_id = exerciseId
      this.trainingExercises.push(newItem)
      return newItem.id
    },

    delTrainingExercise (id: number) {
      this.trainingExercises = this.trainingExercises.filter(e => e.id !== id)
      this.trainingExercises.forEach(e => {
        if (e.bind_prev === id) e.bind_prev = 0
        if (e.bind_next === id) e.bind_next = 0
      })
    },

    async saveTrainings () {
      try {
        await Filesystem.writeFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          recursive: true,
          encoding: Encoding.UTF8,
          data: JSON.stringify(this.savedData),
        })
      } catch (e: any) {
        this.addToast({ color: 'negative', text: 'Не удалось сохранить данные' })
      }
    },

    async loadTrainings () {
      try {
        const result = await Filesystem.readFile({
          directory: Directory.External,
          path: `db/${StoreNames.TRAININGS}.json`,
          encoding: Encoding.UTF8,
        })
        const parsed = JSON.parse(result.data as string)

        this.setSavedData(parsed)
      } catch (e) {
        this.saveTrainings()
      }
    },
  },
})
