<template>
  <q-footer>
    <q-toolbar class="justify-center">
      <q-btn
        v-for="(button, iButton) in buttons"
        :key="iButton"
        class="q-pa-sm"
        :class="button.class"
        flat
        stack
        :icon="button.icon"
        no-caps
        @click="$emit(button.emit)"
      >
        <span class="text-caption">{{ button.text }}</span>
      </q-btn>
    </q-toolbar>
  </q-footer>
</template>
<script setup lang="ts">
defineOptions({
  name: 'TdFooter',
});

defineProps<{
  buttons: Array<{
    class?: string
    text: string
    icon: string
    emit: string
  }>
}>();
</script>
