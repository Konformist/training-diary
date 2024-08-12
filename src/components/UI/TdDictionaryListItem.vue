<template>
  <v-list-item @click.self="click()">
    <template #prepend>
      <slot name="prepend" />
    </template>
    <v-list-item-title @click="click()">
      {{ title || '—' }}
    </v-list-item-title>
    <v-list-item-subtitle @click="click()">
      {{ subtitle }}
    </v-list-item-subtitle>
    <template #append>
      <v-list-item-action end>
        <v-btn color="error" icon="$delete" variant="text" @click="clickDelete()" />
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
  import { Dialog } from '@capacitor/dialog'

  const emit = defineEmits<{
    click: [void]
    delete: [void]
  }>()
  defineProps<{
    title?: string
    subtitle?: string
  }>()

  const click = () => emit('click')
  const clickDelete = async () => {
    if ((await Dialog.confirm({ message: 'Действительно удалить?' })).value) {
      emit('delete')
    }
  }
</script>
