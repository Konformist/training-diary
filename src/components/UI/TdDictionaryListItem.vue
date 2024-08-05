<template>
  <v-list-item @click.self="click()">
    <template #prepend>
      <slot name="prepend" />
    </template>
    <v-list-item-title @click="click()">
      {{ title || '—' }}
    </v-list-item-title>
    <template #append>
      <v-list-item-action end>
        <v-dialog max-width="500">
          <template #activator="{ props: activatorProps }">
            <v-btn color="error" icon="$delete" variant="text" v-bind="activatorProps" />
          </template>
          <template #default="{ isActive }">
            <v-card title="Внимание!">
              <v-card-text>
                Действительно удалить?
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="secondary"
                  text="Нет"
                  @click="isActive.value = false"
                />
                <v-btn
                  text="Да"
                  @click="$emit('delete')"
                />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{
    click: [void]
    delete: [void]
  }>()
  defineProps<{
    title?: string
  }>()

  const click = () => emit('click')
</script>
