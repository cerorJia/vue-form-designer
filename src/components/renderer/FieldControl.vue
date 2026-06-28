<script setup lang="ts">
import { computed } from 'vue'
import {
  Checkbox,
  DatePicker,
  Input as AInput,
  InputNumber,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from 'ant-design-vue'
import type { FormFieldSchema } from '@/types/schema'

const props = defineProps<{ field: FormFieldSchema }>()
const model = defineModel<unknown>()

const placeholder = computed(() => props.field.placeholder)
const disabled = computed(() => props.field.disabled ?? false)
const options = computed(() => props.field.options ?? [])
const fieldProps = computed(() => props.field.props ?? {})
</script>

<template>
  <AInput
    v-if="field.type === 'input'"
    v-model:value="model as string"
    :placeholder="placeholder"
    :disabled="disabled"
    allow-clear
  />

  <Textarea
    v-else-if="field.type === 'textarea'"
    v-model:value="model as string"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="(fieldProps.rows as number) ?? 3"
    :style="{ resize: 'none' }"
    allow-clear
  />

  <InputNumber
    v-else-if="field.type === 'number'"
    v-model:value="model as number"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="fieldProps.min as number"
    :max="fieldProps.max as number"
    :step="(fieldProps.step as number) ?? 1"
    style="width: 100%"
  />

  <Select
    v-else-if="field.type === 'select'"
    v-model:value="model as string"
    :placeholder="placeholder"
    :disabled="disabled"
    :options="options"
    allow-clear
    style="width: 100%"
  />

  <RadioGroup
    v-else-if="field.type === 'radio'"
    v-model:value="model as string"
    :disabled="disabled"
    :options="options"
  />

  <Checkbox.Group
    v-else-if="field.type === 'checkbox'"
    v-model:value="model as (string | number)[]"
    :disabled="disabled"
    :options="options"
  />

  <DatePicker
    v-else-if="field.type === 'date'"
    v-model:value="model as string"
    :placeholder="placeholder"
    :disabled="disabled"
    :value-format="(fieldProps.format as string) ?? 'YYYY-MM-DD'"
    :format="(fieldProps.format as string) ?? 'YYYY-MM-DD'"
    :show-time="(fieldProps.showTime as boolean) ?? false"
    style="width: 100%"
  />

  <Switch
    v-else-if="field.type === 'switch'"
    v-model:checked="model as boolean"
    :disabled="disabled"
  />
</template>
