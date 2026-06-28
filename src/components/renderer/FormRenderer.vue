<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Col, Divider, Form, FormItem, Row } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { FormSchema } from '@/types/schema'
import { buildRules } from '@/composables/useFormRules'
import { buildDefaultValues } from '@/utils/schema'
import FieldControl from './FieldControl.vue'

const props = defineProps<{ schema: FormSchema }>()

const formRef = ref<FormInstance>()
const formData = reactive<Record<string, unknown>>(buildDefaultValues(props.schema.fields))

// schema 变化时重建默认值（保留同名字段已填内容）
watch(
  () => props.schema.fields,
  (fields) => {
    const defaults = buildDefaultValues(fields)
    for (const key of Object.keys(formData)) {
      if (!(key in defaults)) delete formData[key]
    }
    for (const [key, val] of Object.entries(defaults)) {
      if (!(key in formData)) formData[key] = val
    }
  },
  { deep: true },
)

const rules = computed(() => buildRules(props.schema.fields))
const labelCol = computed(() =>
  props.schema.layout === 'horizontal'
    ? { style: { width: `${props.schema.labelWidth ?? 100}px` } }
    : undefined,
)

async function validate(): Promise<Record<string, unknown>> {
  await formRef.value?.validate()
  return getValues()
}

function getValues(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(formData))
}

function setValues(values: Record<string, unknown>): void {
  Object.assign(formData, values)
}

function resetFields(): void {
  formRef.value?.resetFields()
}

defineExpose({ validate, getValues, setValues, resetFields })
</script>

<template>
  <Form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :layout="schema.layout ?? 'horizontal'"
    :label-col="labelCol"
  >
    <Row :gutter="16">
      <template v-for="field in schema.fields" :key="field.id">
        <Col v-if="field.type === 'divider'" :span="24">
          <Divider orientation="left">{{ field.label }}</Divider>
        </Col>

        <Col v-else-if="!field.hidden" :span="field.span ?? 24">
          <FormItem :label="field.label" :name="field.field">
            <FieldControl :field="field" v-model="formData[field.field]" />
          </FormItem>
        </Col>
      </template>
    </Row>
  </Form>
</template>
