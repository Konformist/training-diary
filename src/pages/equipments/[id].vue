<template>
  <v-main>
    <v-container class="pb-fab">
      <v-text-field
        v-model="current.name"
        label="Имя"
        @change="current.name = current.name.trim()"
        @update:model-value="changed = true"
      />
    </v-container>
    <v-fab
      app
      appear
      class="me-4"
      icon="$content-save"
      location="bottom end"
      size="large"
      @click="save()"
    />
  </v-main>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app'
  import EquipmentModel from '@/core/entities/equipment/EquipmentModel'
  import { onBeforeRouteLeave } from 'vue-router'

  definePage({
    meta: { title: 'Изменение экипировки', isBack: true },
  })

  const route = useRoute()
  const appStore = useAppStore()

  const currentId = 'id' in route.params ? +route.params.id : 0

  /** Что-то было изменено */
  const changed = ref(false)
  const current = computed(() => (
    appStore.equipments.find(e => e.id === currentId) || new EquipmentModel()
  ))

  const save = async () => {
    await appStore.saveTrainings()
    changed.value = false
    appStore.addToast('Успешно сохранено')
    return true
  }

  onBeforeRouteLeave(async () => !changed.value || save())
</script>
