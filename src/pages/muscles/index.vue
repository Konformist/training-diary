<template>
  <v-main>
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pa-0 pb-16">
      <v-list class="mb-4">
        <TdDictionaryListItem
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          @click="moveItem(item.id)"
          @delete="delItem(item.id)"
        />
      </v-list>
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

  definePage({
    meta: { title: 'Справочник мышц' },
  })

  const router = useRouter()
  const appStore = useAppStore()

  const isEmpty = computed(() => !appStore.muscles.length)
  const list = computed(() => (sortByFields(appStore.muscles, ['name'])))

  const moveItem = (id: number) => {
    router.push({ name: '/muscles/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addMuscle()
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delMuscle(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
