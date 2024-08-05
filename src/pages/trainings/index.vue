<template>
  <TdLayout title="Список тренировок">
    <template #header>
      <v-btn
        append-icon="$triangle-small-down"
        class="ml-4"
        rounded="1"
        size="small"
        :text="tagName"
        variant="outlined"
        @click="dialogFilter = true"
      />
    </template>
    <v-empty-state
      v-if="isEmpty"
      text="Добавьте, чтобы было"
      title="Здесь ничего нет"
    />
    <v-container v-else class="pb-16">
      <v-slide-x-transition group>
        <TrainingCard
          v-for="(item, index) in list"
          :key="item.id"
          :class="index ? 'mt-4' : ''"
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
      <v-bottom-sheet v-model="dialogFilter">
        <v-card>
          <v-list>
            <v-list-subheader title="Метка" />
            <v-list-item
              v-for="tag in tagsItems"
              :key="tag.id"
              :active="trainingsPageStore.options.tagId === tag.id"
              :title="tag.name"
              @click="trainingsPageStore.options.tagId = tag.id"
            >
              <template #prepend="{ isActive }">
                <v-list-item-action start>
                  <v-radio :model-value="isActive" />
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-bottom-sheet>
    </template>
  </TdLayout>
</template>

<script setup lang="ts">
  import { withZero } from '@/core/utils/items'
  import { sortByFields } from '@/core/utils/arrays'
  import { useAppStore } from '@/stores/app'
  import TrainingCard from '@/components/TrainingCard.vue'
  import useTrainingsPageStore from '@/stores/trainingsPage'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const appStore = useAppStore()
  const trainingsPageStore = useTrainingsPageStore()

  const dialogFilter = ref(false)

  const tagsItems = computed(() => withZero(appStore.tags, true))
  const tagName = computed(() => (
    appStore.tags.find(e => e.id === trainingsPageStore.options.tagId)?.name || 'Метка'
  ))

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
