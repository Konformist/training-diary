<template>
  <v-main>
    <v-container class="pb-16">
      <div class="q-pa-md">
        <v-text-field
          v-model="current.name"
          label="Название тренировки"
          @change="current.name = current.name.trim()"
          @update:model-value="changed = true"
        />
        <v-select
          v-model="current.tag_id"
          :items="tagsItems"
          label="Метка"
          @update:model-value="changed = true"
        />
        <div class="d-flex">
          <TdDateInput
            v-model="dateTime"
            class="mr-4"
            label="Дата"
            @change="changed = true"
          />
          <TdTimeInput
            v-model="dateTime"
            label="Время"
            @change="changed = true"
          />
        </div>
        <v-textarea
          v-model="current.comment"
          auto-grow
          label="Комментарий"
          max-rows="4"
          rows="1"
          @change="current.comment = current.comment.trim()"
          @update:model-value="changed = true"
        />
      </div>
      <v-card class="mb-4">
        <v-list>
          <v-list-subheader>
            Упражнения
          </v-list-subheader>
          <template
            v-for="(item, index) in trainingExercises"
            :key="item.id"
          >
            <v-divider v-if="!item.bind_prev" />
            <TrainingExerciseCard
              :exercise="item"
              :has-next="index !== trainingExercises.length - 1"
              :has-prev="index !== 0"
              @bind-next="bindExerciseNext($event)"
              @bind-prev="bindExercisePrev($event)"
              @delete="delExercise($event)"
              @unbind-next="unbindExerciseNext($event)"
              @unbind-prev="unbindExercisePrev($event)"
            />
          </template>
        </v-list>
      </v-card>
    </v-container>
    <v-speed-dial
      location="top end"
      transition="scale-transition"
    >
      <template #activator="{ props: activatorProps, isActive }">
        <v-fab
          v-bind="activatorProps"
          app
          appear
          :icon="isActive ? '$window-close' : '$plus'"
          location="bottom end"
          size="large"
        />
      </template>
      <v-btn key="save" class="mr-2" icon="$content-save" @click="save()" />
      <v-btn key="copy" class="mr-2" icon="$content-copy" @click="copy()" />
      <v-btn key="add" class="mr-2" icon="$plus" @click="addExercise()" />
    </v-speed-dial>
  </v-main>
</template>

<script setup lang="ts">
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import TrainingModel from '@/core/entities/training/TrainingModel'
  import { onBeforeRouteLeave } from 'vue-router'

  definePage({
    meta: { title: 'Изменение тренировки', isBack: true },
  })

  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()

  const tagsItems = computed(() => withZero(appStore.tags))

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.trainings.find(e => e.id === currentId) || new TrainingModel()
  ))

  const dateTime = computed({
    get: () => new Date(current.value.date),
    set: val => current.value.date = val.getTime(),
  })

  const trainingExercises = computed(() => (
    appStore.trainingExercises.filter(e => e.training_id === current.value.id)
  ))

  const addExercise = () => {
    const id = appStore.addTrainingExercise(current.value.id)
    changed.value = true
    router.push({ name: '/training-exercises/[id]', params: { id } })
  }

  const bindExerciseNext = (id: number) => {
    const curIndex = trainingExercises.value.findIndex(e => e.id === id)
    const curExercise = trainingExercises.value[curIndex]
    const nextExercise = trainingExercises.value[curIndex + 1]

    if (!nextExercise || !curExercise) return

    curExercise.bind_next = nextExercise.id
    nextExercise.bind_prev = id
    changed.value = true
  }

  const unbindExerciseNext = (id: number) => {
    const curIndex = trainingExercises.value.findIndex(e => e.id === id)
    const curExercise = trainingExercises.value[curIndex]
    const nextExercise = trainingExercises.value[curIndex + 1]

    if (!nextExercise || !curExercise) return

    curExercise.bind_next = 0
    nextExercise.bind_prev = 0
    changed.value = true
  }

  const bindExercisePrev = (id: number) => {
    const curIndex = trainingExercises.value.findIndex(e => e.id === id)
    const curExercise = trainingExercises.value[curIndex]
    const prevExercise = trainingExercises.value[curIndex - 1]

    if (!prevExercise || !curExercise) return

    curExercise.bind_prev = prevExercise.id
    prevExercise.bind_next = id
    changed.value = true
  }

  const unbindExercisePrev = (id: number) => {
    const curIndex = trainingExercises.value.findIndex(e => e.id === id)
    const curExercise = trainingExercises.value[curIndex]
    const prevExercise = trainingExercises.value[curIndex - 1]

    if (!prevExercise || !curExercise) return

    curExercise.bind_prev = 0
    prevExercise.bind_next = 0
    changed.value = true
  }

  const delExercise = async (id: number) => {
    appStore.delTrainingExercise(id)
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно удалено')
  }

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  const copy = async () => {
    const id = appStore.copyTraining(current.value.id)
    await save()
    appStore.addToast('Успешно скопировано')
    await router.replace({ name: '/trainings/[id]', params: { id } })
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
