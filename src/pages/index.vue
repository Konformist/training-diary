<template>
  <v-main v-touch="{ left: nextDate, right: prevDate }">
    <v-container class="pb-16">
      <TdDatePicker
        v-model="indexPageStore.selectDate"
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
    <v-fab
      app
      appear
      class="me-4"
      icon="$plus"
      location="bottom end"
      size="large"
      @click="addItem()"
    />
  </v-main>
</template>

<script lang="ts" setup>
  import { palette } from '@/core/dictionaries/colors'
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import useIndexPageStore from '@/stores/indexPage'
  import { useDate } from 'vuetify'

  definePage({
    meta: { title: 'Главная' },
  })

  const date = useDate()
  const router = useRouter()
  const appStore = useAppStore()
  const indexPageStore = useIndexPageStore()

  const getTag = (id: number) => appStore.tags.find(e => e.id === id)

  const trainingDates = computed(() => (
    appStore.trainings.map(e => ({
      date: new Date(e.date),
      color: palette[getTag(e.tag_id)?.color || 0] || 'primary',
    }))
  ))

  const list = computed(() => {
    const arr = appStore.trainings.filter(e => (
      date.format(new Date(e.date), 'keyboardDate') === date.format(indexPageStore.selectDate, 'keyboardDate')
    ))

    return sortByFields(arr, ['date'], true)
  })

  const moveItem = (id: number) => {
    router.push({ name: '/trainings/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addTraining(indexPageStore.selectDate)
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delTraining(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }

  const prevDate = () => indexPageStore.selectDate = date.addDays(indexPageStore.selectDate, -1) as Date
  const nextDate = () => indexPageStore.selectDate = date.addDays(indexPageStore.selectDate, 1) as Date
</script>
