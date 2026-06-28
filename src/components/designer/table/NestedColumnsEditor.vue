<script setup lang="ts">
import { Button, Input as AInput, Select } from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnSchema } from '@/types/table'
import { genFieldName, genId } from '@/utils/id'

const model = defineModel<TableColumnSchema[]>({ default: () => [] })

const typeOptions = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '金额', value: 'money' },
]

function addColumn(): void {
  const idx = model.value.length + 1
  model.value = [
    ...model.value,
    { id: genId('sub'), type: 'text', field: genFieldName('sub'), title: `子列${idx}` },
  ]
}

function removeColumn(index: number): void {
  const next = [...model.value]
  next.splice(index, 1)
  model.value = next
}

function update(index: number, key: 'title' | 'field' | 'type', val: string): void {
  const next = model.value.map((c) => ({ ...c }))
  // @ts-expect-error 动态键赋值
  next[index][key] = val
  model.value = next
}
</script>

<template>
  <div class="nested-editor">
    <div class="head">
      <span>表头</span>
      <span>参数</span>
      <span>类型</span>
      <span></span>
    </div>
    <div v-for="(col, index) in model" :key="col.id" class="row">
      <AInput
        :value="col.title"
        size="small"
        placeholder="表头"
        @update:value="(v: string) => update(index, 'title', v)"
      />
      <AInput
        :value="col.field"
        size="small"
        placeholder="参数"
        @update:value="(v: string) => update(index, 'field', v)"
      />
      <Select
        :value="col.type"
        size="small"
        :options="typeOptions"
        @update:value="(v) => update(index, 'type', v as string)"
      />
      <Button type="text" danger size="small" @click="removeColumn(index)">
        <template #icon><DeleteOutlined /></template>
      </Button>
    </div>
    <Button type="dashed" block size="small" @click="addColumn">
      <template #icon><PlusOutlined /></template>
      添加子列
    </Button>
  </div>
</template>

<style scoped lang="less">
.head,
.row {
  display: grid;
  grid-template-columns: 1fr 1fr 70px 30px;
  gap: 6px;
  align-items: center;
}
.head {
  margin-bottom: 6px;
  font-size: 12px;
  color: #8c8c8c;
}
.row {
  margin-bottom: 6px;
}
</style>
