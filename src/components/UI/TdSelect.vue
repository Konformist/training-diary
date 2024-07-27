<template>
  <q-select
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
import { defineModel } from 'vue';

defineOptions({
  name: 'TdSelect',
});

const modelValue = defineModel({ default: 0 });

defineProps<{
  options: unknown[]
}>();
</script>
