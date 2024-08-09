<template>
  <v-input hide-details>
    <v-field
      :dirty="!!modelValue || isActive"
      :label="label"
    >
      <template #default="{ props }">
        <imask-input
          v-bind="props"
          :blocks="blocks"
          :inputmode="inputmode"
          :mask="mask"
          :model-value="modelValue"
          @blur="isActive = false"
          @focus="isActive = true"
          @update:model-value="$emit('update:modelValue', $event)"
        />
      </template>
    </v-field>
  </v-input>
</template>

<script lang="ts" setup>
  defineEmits<{
    'update:modelValue': [string]
  }>()
  defineProps<{
    inputmode?: string
    label?: string
    modelValue: string
    mask?: string
    blocks?: Object
  }>()

  const isActive = ref(false)
</script>
