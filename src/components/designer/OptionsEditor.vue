<script setup lang="ts">
import { Button, Input as AInput } from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { SelectOption } from '@/types/schema'

const model = defineModel<SelectOption[]>({ default: () => [] })

function addOption(): void {
  const idx = model.value.length + 1
  model.value = [...model.value, { label: `选项${idx}`, value: String(idx) }]
}

function removeOption(index: number): void {
  const next = [...model.value]
  next.splice(index, 1)
  model.value = next
}

function update(index: number, key: 'label' | 'value', val: string): void {
  const next = [...model.value]
  next[index] = { ...next[index], [key]: val }
  model.value = next
}
</script>

<template>
  <div class="options-editor">
    <div v-for="(opt, index) in model" :key="index" class="option-row">
      <AInput
        :value="opt.label"
        placeholder="文案"
        size="small"
        @update:value="(v: string) => update(index, 'label', v)"
      />
      <AInput
        :value="String(opt.value)"
        placeholder="值"
        size="small"
        @update:value="(v: string) => update(index, 'value', v)"
      />
      <Button type="text" danger size="small" @click="removeOption(index)">
        <template #icon><DeleteOutlined /></template>
      </Button>
    </div>
    <Button type="dashed" block size="small" @click="addOption">
      <template #icon><PlusOutlined /></template>
      添加选项
    </Button>
  </div>
</template>

<style scoped lang="less">
.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 6px;
  margin-bottom: 6px;
}
</style>
