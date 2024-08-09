<template>
  <v-main>
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pb-16">
      <v-row>
        <v-slide-x-transition group leave-absolute>
          <v-col
            v-for="item in list"
            :key="item.id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <TrainingCard
              :training="item"
              @change="moveItem($event)"
              @delete="delItem($event)"
            />
          </v-col>
        </v-slide-x-transition>
      </v-row>
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

<script setup lang="ts">
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import useTrainingsPageStore from '@/stores/trainingsPage'

  definePage({
    meta: { title: 'Список тренировок' },
  })

  const router = useRouter()
  const appStore = useAppStore()
  const trainingsPageStore = useTrainingsPageStore()

  const isEmpty = computed(() => !appStore.trainings.length)
  const list = computed(() => {
    const arr = appStore.trainings.filter(e => (
      !trainingsPageStore.options.tagId ||
      e.tag_id === trainingsPageStore.options.tagId
    ))

    return sortByFields(arr, ['date'], true)
  })

  const moveItem = (id: number) => {
    router.push({ name: '/trainings/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addTraining()
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
