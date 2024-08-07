<template>
  <v-btn
    append-icon="$triangle-small-down"
    class="ml-4"
    rounded="1"
    size="small"
    :text="tagName"
    variant="outlined"
    @click="dialogFilter = true"
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

<script setup lang="ts">
  import { withZero } from '@/core/utils/items'
  import { useAppStore } from '@/stores/app'
  import useTrainingsPageStore from '@/stores/trainingsPage'
  import { computed, ref } from 'vue'

  const appStore = useAppStore()
  const trainingsPageStore = useTrainingsPageStore()

  const dialogFilter = ref(false)

  const tagsItems = computed(() => withZero(appStore.tags, true))
  const tagName = computed(() => (
    appStore.tags.find(e => e.id === trainingsPageStore.options.tagId)?.name || 'Метка'
  ))
</script>
