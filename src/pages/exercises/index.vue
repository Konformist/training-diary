<template>
  <TdLayout title="Справочник упражнений">
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pa-0 pb-16">
      <v-list>
        <template
          v-for="item in list"
          :key="item[0]"
        >
          <v-list-subheader v-if="item[0]" :title="getMuscleName(item[0]) || '—'" />
          <TdDictionaryListItem
            v-for="subItem in item[1]"
            :key="subItem.id"
            :title="subItem.name"
            @click="moveItem(subItem.id)"
            @delete="delItem(subItem.id)"
          />
        </template>
      </v-list>
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

<script setup lang="ts">
  import { groupByField, sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const appStore = useAppStore()

  const getMuscleName = (value: number) => (appStore.muscles.find(e => e.id === value)?.name || '')

  const isEmpty = computed(() => !appStore.exercises.length)
  const list = computed(() => {
    const arr = sortByFields(appStore.exercises, ['muscle_group_id', 'name'])

    return groupByField(arr, 'muscle_group_id')
  })

  const moveItem = (id: number) => {
    router.push({ name: '/exercises/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addExercise()
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delExercise(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
