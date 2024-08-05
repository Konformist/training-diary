<template>
  <v-card
    :color="trainingTag ? palette[trainingTag.color] : undefined"
    variant="outlined"
  >
    <v-card-item>
      <v-card-title>
        {{ trainingTag?.name || current.name || '—' }}
      </v-card-title>
      <v-card-subtitle>
        {{ trainingDate }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      Тоннаж {{ totalWeight }} кг
    </v-card-text>
    <v-card-actions>
      <v-dialog max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn
            color="red"
            text="Удалить"
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
      <v-spacer />
      <v-btn
        color="secondary"
        text="Изменить"
        @click="$emit('change', current.id)"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app'
  import { computed } from 'vue'
  import { palette } from '@/core/dictionaries/colors'
  import TrainingModel from '@/core/entities/training/TrainingModel'
  import { useDate } from 'vuetify'

  const date = useDate()
  const appStore = useAppStore()

  defineEmits<{
    delete: [number]
    change: [number]
  }>()
  const props = defineProps<{
    training: TrainingModel
  }>()

  const current = computed(() => props.training)

  const trainingDate = computed(() => date.format(new Date(current.value.date), 'keyboardDateTime24h'))

  const trainingTag = computed(() => (
    appStore.tags.find(e => e.id === current.value.tag_id)
  ))

  const totalWeight = computed(() => (
    appStore.trainingExercises
      .filter(e => e.training_id === current.value.id)
      .reduce((acc, cur) => (acc + (cur.approaches * cur.repetitions * cur.weight)), 0)
      .toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  ))
</script>
