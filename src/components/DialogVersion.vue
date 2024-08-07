<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title />
      <v-card-text>
        Доступна новая версия, скачать?
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          text="Нет"
          @click="$emit('update:modelValue', false)"
        />
        <v-btn
          download
          :href="link"
          text="Да"
          @click="$emit('update:modelValue', false)"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  defineEmits<{
    'update:modelValue': [boolean]
  }>()
  defineProps<{
    modelValue: boolean
    link: string
  }>()
</script>
