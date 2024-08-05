<template>
  <v-text-field
    :active="menu"
    :label="label"
    :model-value="date.format(modelValue, 'keyboardDate')"
    prepend-inner-icon="$calendar"
    readonly
  >
    <v-dialog
      v-model="menu"
      activator="parent"
      width="auto"
    >
      <v-card>
        <v-date-picker
          v-model="value"
          show-adjacent-months
          @change="sendValue($event)"
        />
        <v-card-actions>
          <v-btn text="Закрыть" @click="menu = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-text-field>
</template>

<script lang="ts" setup>
  import { useDate } from 'vuetify'

  const emit = defineEmits<{
    'change': [Date]
    'update:modelValue': [Date]
  }>()
  const props = withDefaults(defineProps<{
    modelValue?: Date
    label?: string
  }>(), { modelValue: () => new Date() })

  const date = useDate()
  const menu = ref(false)

  const sendValue = (val: Date) => {
    let newDate = date.setDate(props.modelValue, val.getDate()) as Date
    newDate = date.setMonth(newDate, val.getMonth()) as Date
    newDate = date.setYear(newDate, val.getFullYear()) as Date
    emit('update:modelValue', newDate)
    emit('change', newDate)
  }

  const value = computed({
    get: () => props.modelValue,
    set: val => sendValue(val),
  })
</script>
