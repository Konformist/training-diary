<template>
  <TdLayout title="Справочник экипировки">
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pa-0 pb-16">
      <v-list>
        <TdDictionaryListItem
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          @click="moveItem(item.id)"
          @delete="delItem(item.id)"
        />
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
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const appStore = useAppStore()

  const isEmpty = computed(() => !appStore.equipments.length)
  const list = computed(() => (sortByFields(appStore.equipments, ['name'])))

  const moveItem = (id: number) => {
    router.push({ name: '/equipments/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addEquipment()
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delEquipment(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
