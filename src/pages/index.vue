<template>
  <TdLayout :title="appStore.appInfo.name">
    <v-container class="pb-16">
      <TdDatePicker
        v-model="appStore.selectDate"
        class="py-3 mb-4"
        :events="trainingDates"
      />
      <v-slide-x-transition group leave-absolute>
        <TrainingCard
          v-for="item in list"
          :key="item.id"
          class="mb-4"
          :training="item"
          @change="moveItem($event)"
          @delete="delItem($event)"
        />
      </v-slide-x-transition>
    </v-container>
    <template #footer>
      <v-fab
        app
        appear
        class="me-4"
        icon="$plus"
        location="bottom end"
        size="large"
        @click="addItem()"
      />
    </template>
  </TdLayout>
</template>

<script lang="ts" setup>
  import TrainingCard from '@/components/TrainingCard.vue'
  import TdDatePicker from '@/components/UI/TdDatePicker.vue'
  import { palette } from '@/core/dictionaries/colors'
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import { useDate } from 'vuetify'

  const date = useDate()
  const router = useRouter()
  const appStore = useAppStore()

  const getTag = (id: number) => appStore.tags.find(e => e.id === id)

  const trainingDates = computed(() => (
    appStore.trainings.map(e => ({
      date: new Date(e.date),
      color: palette[getTag(e.tag_id)?.color || 0] || 'primary',
    }))
  ))

  const list = computed(() => {
    const arr = appStore.trainings.filter(e => (
      date.format(new Date(e.date), 'keyboardDate') === date.format(appStore.selectDate, 'keyboardDate')
    ))

    return sortByFields(arr, ['date'], true)
  })

  const moveItem = (id: number) => {
    router.push({ name: '/trainings/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addTraining(appStore.selectDate)
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delTraining(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
