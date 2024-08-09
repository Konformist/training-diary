<template>
  <v-main>
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pa-0 pb-fab">
      <v-list>
        <TdDictionaryListItem
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          @click="moveItem(item.id)"
          @delete="delItem(item.id)"
        >
          <template #prepend>
            <v-avatar
              class="mr-2"
              :class="`bg-${palette[item.color]}-darken-2`"
              size="24"
              @click="moveItem(item.id)"
            />
          </template>
        </TdDictionaryListItem>
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
  import { palette } from '@/core/dictionaries/colors'
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'

  definePage({
    meta: { title: 'Справочник меток' },
  })

  const router = useRouter()
  const appStore = useAppStore()

  const isEmpty = computed(() => !appStore.tags.length)
  const list = computed(() => (sortByFields(appStore.tags, ['name'])))

  const moveItem = (id: number) => {
    router.push({ name: '/tags/[id]', params: { id } })
  }

  const addItem = async () => {
    const id = appStore.addTag()
    await appStore.saveTrainings()
    moveItem(id)
    appStore.addToast('Успешно добавлено')
  }

  const delItem = async (id: number) => {
    appStore.delTag(id)
    await appStore.saveTrainings()
    appStore.addToast('Успешно удалено')
  }
</script>
