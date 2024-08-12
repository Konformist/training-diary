<template>
  <v-card
    :color="trainingColor"
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
      <v-btn
        color="red"
        text="Удалить"
        @click="clickDelete()"
      />
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
  import { Dialog } from '@capacitor/dialog'
  import { computed } from 'vue'
  import { palette } from '@/core/dictionaries/colors'
  import TrainingModel from '@/core/entities/training/TrainingModel'
  import { useDate } from 'vuetify'

  const date = useDate()
  const appStore = useAppStore()

  const emit = defineEmits<{
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

  const trainingColor = computed(() => {
    if (!trainingTag.value) return
    return appStore.darkMode === 'light'
      ? `${palette[trainingTag.value.color]}-darken-4`
      : palette[trainingTag.value.color]
  })

  const totalWeight = computed(() => (
    appStore.trainingExercises
      .filter(e => e.training_id === current.value.id)
      .reduce((acc, cur) => (acc + (cur.approaches * cur.repetitions * cur.weight)), 0)
      .toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  ))

  const clickDelete = async () => {
    if ((await Dialog.confirm({ message: 'Действительно удалить?' })).value) {
      emit('delete', current.value.id)
    }
  }
</script>
