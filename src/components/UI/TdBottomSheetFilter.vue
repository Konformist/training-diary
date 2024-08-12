<template>
  <v-bottom-sheet v-model="opened">
    <v-card>
      <v-list>
        <v-list-subheader :title="title" />
        <v-list-item
          v-for="tag in items"
          :key="tag.id"
          :active="modelValue === tag.id"
          :title="tag.name"
          @click="modelValue = tag.id"
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

<script lang="ts" setup>
  const modelValue = defineModel<number>({ default: 0 })
  const opened = defineModel<boolean>('opened', { default: false })

  defineProps<{
    title: string
    items: any[]
  }>()
</script>
