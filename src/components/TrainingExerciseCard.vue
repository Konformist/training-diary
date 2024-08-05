<template>
  <v-list-item @click.self="movePage()">
    <v-list-item-title @click="movePage()">
      {{ exerciseName || 'Не выбрано' }}
    </v-list-item-title>
    <v-list-item-subtitle @click="movePage()">
      {{ exerciseInfo }}
    </v-list-item-subtitle>
    <template #append>
      <v-list-item-action end>
        <v-menu>
          <template #activator="{ props: activatorProps }">
            <v-btn color="white" icon="$dots-vertical" variant="text" v-bind="activatorProps" />
          </template>
          <v-list>
            <v-list-item
              :disabled="!hasPrev"
              :title="current.bind_prev ? 'Отвязать от суперсета с предыдущим' : 'Связать в суперсет с предыдущим'"
              @click="setBindPrev()"
            />
            <v-list-item
              :disabled="!hasNext"
              :title="current.bind_next ? 'Отвязать от суперсета со следующим' : 'Связать в суперсет со следующим'"
              @click="setBindNext()"
            />
            <v-dialog max-width="500">
              <template #activator="{ props: activatorProps }">
                <v-list-item
                  class="text-red"
                  title="Удалить"
                  v-bind="activatorProps"
                />
              </template>
              <template #default="{ isActive }">
                <v-card title="Внимание!">
                  <v-card-text>
                    Действительно удалить?
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="secondary"
                      text="Нет"
                      @click="isActive.value = false"
                    />
                    <v-btn
                      text="Да"
                      @click="$emit('delete', current.id)"
                    />
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'
  import TrainingExerciseModel from '@/core/entities/training-exercise/TrainingExerciseModel'

  const emit = defineEmits<{
    'bindNext': [number]
    'unbindNext': [number]
    'bindPrev': [number]
    'unbindPrev': [number]
    'delete': [number]
  }>()

  const props = defineProps<{
    hasNext?: boolean
    hasPrev?: boolean
    exercise: TrainingExerciseModel
  }>()

  const appStore = useAppStore()
  const router = useRouter()

  const current = computed(() => props.exercise)

  const movePage = () => {
    router.push({ name: '/training-exercises/[id]', params: { id: current.value.id } })
  }

  const exerciseName = computed(() => (
    appStore.exercises.find(e => e.id === current.value.exercise_id)?.name || ''
  ))

  const exerciseStat = computed(() => ([
    current.value.approaches,
    current.value.repetitions,
    current.value.weight,
  ].join('x')))

  const exerciseInfo = computed(() => {
    const ret = []
    if (current.value.bind_prev || current.value.bind_next) ret.push('Суперсет')
    if (current.value.rest_time) ret.push(current.value.rest_time)
    ret.push(exerciseStat.value)
    return ret.join(' ')
  })

  const setBindPrev = () => {
    if (current.value.bind_prev) {
      emit('unbindPrev', current.value.id)
    } else {
      emit('bindPrev', current.value.id)
    }
  }

  const setBindNext = () => {
    if (current.value.bind_next) {
      emit('unbindNext', current.value.id)
    } else {
      emit('bindNext', current.value.id)
    }
  }
</script>
