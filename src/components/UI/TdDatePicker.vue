<template>
  <v-card class="overflow-hidden">
    <div class="d-flex align-center px-3 pb-3">
      <v-btn
        :disabled="viewMode !== 'month'"
        icon="$chevron-left"
        ripple
        variant="text"
        @click="prev()"
      />
      <v-spacer />
      <v-btn
        :active="viewMode === 'months'"
        class="text-body-2 font-weight-regular mr-3"
        ripple
        rounded
        :text="date.format(currentDate, 'month')"
        variant="text"
        @click="setViewMode('months')"
      />
      <v-btn
        :active="viewMode === 'year'"
        class="text-body-2 font-weight-regular"
        ripple
        rounded
        :text="date.format(currentDate, 'year')"
        variant="text"
        @click="setViewMode('year')"
      />
      <v-spacer />
      <v-btn
        :disabled="viewMode !== 'month'"
        icon="$chevron-right"
        ripple
        variant="text"
        @click="next()"
      />
    </div>
    <v-date-picker-months
      v-if="viewMode === 'months'"
      v-model="currentMonth"
      @update:model-value="setViewMode('month')"
    />
    <v-date-picker-years
      v-else-if="viewMode === 'year'"
      v-model="currentYear"
      @update:model-value="setViewMode('month')"
    />
    <v-date-picker-month
      v-else
      :model-value="[modelValue]"
      :month="currentMonth"
      show-adjacent-months
      weeks-in-month="static"
      :year="currentYear"
      @update:model-value="modelValue = $event"
    >
      <template #day="{ item }">
        <v-btn
          :color="getColorDate(item.date)"
          @click="modelValue = item.date"
        />
      </template>
    </v-date-picker-month>
  </v-card>
</template>

<script lang="ts" setup>
  import { useDate } from 'vuetify'

  const modelValue = defineModel<Date>({ default: () => new Date() })

  const props = defineProps<{
    events?: Array<{ color: string, date: Date }>
  }>()

  type TViewMode = 'month'|'year'|'months'

  const viewMode = ref<TViewMode>('month')

  const currentDate = ref(new Date(modelValue.value))
  watch(modelValue, val => currentDate.value = new Date(val))

  const date = useDate()

  const currentMonth = computed({
    get: () => currentDate.value.getMonth(),
    set: val => currentDate.value = date.setMonth(currentDate.value, val) as Date,
  })

  const currentYear = computed({
    get: () => currentDate.value.getFullYear(),
    set: val => currentDate.value = date.setYear(currentDate.value, val) as Date,
  })

  const getColorDate = (value: Date) => {
    if (date.format(value, 'keyboardDate') === date.format(modelValue.value, 'keyboardDate')) return
    return props.events?.find(e => (
      date.format(value, 'keyboardDate') === date.format(e.date, 'keyboardDate')
    ))?.color
  }

  const setViewMode = (value: TViewMode) => {
    viewMode.value = viewMode.value === value ? 'month' : value
  }

  const next = () => {
    if (viewMode.value === 'month') currentMonth.value++
    else if (viewMode.value === 'months') currentYear.value++
  }

  const prev = () => {
    if (viewMode.value === 'month') currentMonth.value--
    else if (viewMode.value === 'months') currentYear.value--
  }
</script>
