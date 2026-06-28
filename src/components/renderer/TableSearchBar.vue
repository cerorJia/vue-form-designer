<script setup lang="ts">
import { computed, reactive } from 'vue'
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input as AInput,
  RangePicker,
  Row,
  Select,
  Space,
} from 'ant-design-vue'
import type { TableColumnSchema } from '@/types/table'

const props = defineProps<{ columns: TableColumnSchema[] }>()
const emit = defineEmits<{ search: [params: Record<string, unknown>] }>()

const searchColumns = computed(() => props.columns.filter((c) => c.searchable))
const values = reactive<Record<string, unknown>>({})

function buildParams(): Record<string, unknown> {
  const params: Record<string, unknown> = {}
  for (const col of searchColumns.value) {
    const val = values[col.field]
    if (val === undefined || val === null || val === '') continue
    const param = col.searchParam || col.field
    if (col.searchType === 'dateRange' && Array.isArray(val)) {
      params[`${param}Start`] = val[0]
      params[`${param}End`] = val[1]
    } else {
      params[param] = val
    }
  }
  return params
}

function onSearch(): void {
  emit('search', buildParams())
}

function onReset(): void {
  for (const key of Object.keys(values)) delete values[key]
  emit('search', {})
}
</script>

<template>
  <div v-if="searchColumns.length" class="search-bar">
    <Form layout="inline">
      <Row :gutter="12" style="width: 100%">
        <Col
          v-for="col in searchColumns"
          :key="col.id"
          :span="col.searchSpan ?? 8"
          style="margin-bottom: 12px"
        >
          <FormItem :label="col.title" style="width: 100%">
            <AInput
              v-if="col.searchType === 'input'"
              v-model:value="values[col.field] as string"
              :placeholder="`请输入${col.title}`"
              allow-clear
            />
            <Select
              v-else-if="col.searchType === 'select'"
              v-model:value="values[col.field] as string"
              :placeholder="`请选择${col.title}`"
              :options="col.options ?? []"
              allow-clear
              style="width: 100%"
            />
            <DatePicker
              v-else-if="col.searchType === 'date'"
              v-model:value="values[col.field] as string"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
            <RangePicker
              v-else-if="col.searchType === 'dateRange'"
              v-model:value="values[col.field] as [string, string]"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="search-actions">
      <Space>
        <Button type="primary" @click="onSearch">查询</Button>
        <Button @click="onReset">重置</Button>
      </Space>
    </div>
  </div>
</template>

<style scoped lang="less">
.search-bar {
  padding: 16px 16px 4px;
  background: #fafbfc;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
}
.search-actions {
  text-align: right;
  padding-bottom: 12px;
}
</style>
