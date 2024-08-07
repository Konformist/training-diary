<template>
  <v-text-field
    :active="menu"
    :label="label"
    :model-value="date.format(modelValue, 'fullTime24h')"
    prepend-inner-icon="$clock-time-four-outline"
    readonly
  >
    <v-dialog
      v-model="menu"
      activator="parent"
      width="auto"
    >
      <v-card>
        <v-time-picker
          v-model="value"
          format="24hr"
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

  const sendValue = (val: string) => {
    const [hours, minutes] = val.split(':')
    const newDate = date.date(props.modelValue) as Date
    newDate.setHours(+hours)
    newDate.setMinutes(+minutes)
    newDate.setSeconds(0)
    emit('update:modelValue', newDate)
    emit('change', newDate)
  }

  const value = computed({
    get: () => date.format(props.modelValue, 'fullTime24h'),
    set: val => sendValue(val),
  })
</script>
