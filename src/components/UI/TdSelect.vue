<template>
  <q-select
    :label="label"
    :options="options"
    option-value="id"
    option-label="name"
    standout
    emit-value
    map-options
    v-model="modelValue"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: 'TdSelect',
});

const modelValue = defineModel({ default: 0 });

defineProps<{
  label?: string
  options: unknown[]
}>();
</script>
