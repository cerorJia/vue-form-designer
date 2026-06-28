<script setup lang="ts">
import { computed } from 'vue'
import {
  Checkbox,
  Divider,
  Empty,
  Form,
  FormItem,
  Input as AInput,
  InputNumber,
  Select,
} from 'ant-design-vue'
import type { ColumnType, SearchControlType, TableColumnSchema } from '@/types/table'
import { useTableDesignerStore } from '@/stores/tableDesigner'
import OptionsEditor from '@/components/designer/OptionsEditor.vue'
import NestedColumnsEditor from './NestedColumnsEditor.vue'

const store = useTableDesignerStore()
const col = computed(() => store.activeColumn)

const typeOptions = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '状态标签', value: 'tag' },
  { label: '金额', value: 'money' },
  { label: '子表格', value: 'subtable' },
]
const alignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' },
]
const fixedOptions = [
  { label: '不固定', value: undefined },
  { label: '左固定', value: 'left' },
  { label: '右固定', value: 'right' },
]
const searchTypeOptions = [
  { label: '输入框', value: 'input' },
  { label: '下拉选择', value: 'select' },
  { label: '日期', value: 'date' },
  { label: '日期范围', value: 'dateRange' },
]

const showOptions = computed(
  () => col.value && (col.value.type === 'tag' || col.value.searchType === 'select'),
)

function patch(partial: Partial<TableColumnSchema>): void {
  if (col.value) store.updateColumn(col.value.id, partial)
}
</script>

<template>
  <div class="prop-panel">
    <div class="panel-title">{{ col ? '列属性' : '表格设置' }}</div>

    <!-- 表格级设置 -->
    <Form v-if="!col" layout="vertical" class="prop-form">
      <FormItem label="表格标题">
        <AInput
          :value="store.schema.title"
          @update:value="(v: string) => (store.schema.title = v)"
        />
      </FormItem>
      <FormItem label="表格描述">
        <AInput
          :value="store.schema.description"
          @update:value="(v: string) => (store.schema.description = v)"
        />
      </FormItem>

      <Divider>分页</Divider>
      <div class="switch-row">
        <Checkbox
          :checked="store.schema.pagination.enabled"
          @update:checked="(v) => (store.schema.pagination.enabled = v as boolean)"
        >
          启用分页
        </Checkbox>
      </div>
      <FormItem v-if="store.schema.pagination.enabled" label="每页条数">
        <InputNumber
          :value="store.schema.pagination.pageSize"
          :min="5"
          :max="100"
          :step="5"
          style="width: 100%"
          @update:value="(v) => (store.schema.pagination.pageSize = (v as number) ?? 10)"
        />
      </FormItem>

      <Divider>行操作</Divider>
      <Checkbox.Group
        :value="store.schema.actions.map((a) => a.action)"
        style="display: flex; flex-direction: column; gap: 8px"
        @update:value="
          (vals) =>
            (store.schema.actions = (
              [
                { key: 'detail', label: '详情', action: 'detail' },
                { key: 'edit', label: '编辑', action: 'edit' },
                { key: 'delete', label: '删除', action: 'delete', danger: true },
              ] as const
            ).filter((a) => (vals as string[]).includes(a.action)) as typeof store.schema.actions)
        "
      >
        <Checkbox value="detail">详情</Checkbox>
        <Checkbox value="edit">编辑</Checkbox>
        <Checkbox value="delete">删除</Checkbox>
      </Checkbox.Group>

      <Empty description="点击列卡片以编辑列属性" style="margin-top: 24px" />
    </Form>

    <!-- 列级设置 -->
    <Form v-else layout="vertical" class="prop-form">
      <FormItem label="表头 (title)">
        <AInput :value="col.title" @update:value="(v: string) => patch({ title: v })" />
      </FormItem>
      <FormItem label="字段 / 参数 (field)">
        <AInput :value="col.field" @update:value="(v: string) => patch({ field: v })" />
      </FormItem>
      <FormItem label="列类型">
        <Select
          :value="col.type"
          :options="typeOptions"
          style="width: 100%"
          @update:value="(v) => patch({ type: v as ColumnType })"
        />
      </FormItem>
      <FormItem label="列宽 (px，留空自适应)">
        <InputNumber
          :value="col.width"
          :min="60"
          :max="600"
          style="width: 100%"
          @update:value="(v) => patch({ width: v as number })"
        />
      </FormItem>
      <FormItem label="对齐">
        <Select
          :value="col.align ?? 'left'"
          :options="alignOptions"
          style="width: 100%"
          @update:value="(v) => patch({ align: v as 'left' | 'center' | 'right' })"
        />
      </FormItem>
      <FormItem label="固定列">
        <Select
          :value="col.fixed"
          :options="fixedOptions"
          style="width: 100%"
          @update:value="(v) => patch({ fixed: v as 'left' | 'right' | undefined })"
        />
      </FormItem>

      <!-- 搜索配置（子表格不支持搜索） -->
      <template v-if="col.type !== 'subtable'">
        <Divider>搜索配置</Divider>
        <div class="switch-row">
          <Checkbox
            :checked="col.searchable"
            @update:checked="(v) => patch({ searchable: v as boolean })"
          >
            作为搜索条件
          </Checkbox>
        </div>
        <template v-if="col.searchable">
          <FormItem label="搜索控件">
            <Select
              :value="col.searchType ?? 'input'"
              :options="searchTypeOptions"
              style="width: 100%"
              @update:value="(v) => patch({ searchType: v as SearchControlType })"
            />
          </FormItem>
          <FormItem label="传参名（默认同字段）">
            <AInput
              :value="col.searchParam"
              :placeholder="col.field"
              @update:value="(v: string) => patch({ searchParam: v })"
            />
          </FormItem>
          <FormItem label="搜索宽度 (1-24)">
            <InputNumber
              :value="col.searchSpan ?? 8"
              :min="1"
              :max="24"
              style="width: 100%"
              @update:value="(v) => patch({ searchSpan: (v as number) ?? 8 })"
            />
          </FormItem>
        </template>
      </template>

      <!-- tag / select 选项 -->
      <template v-if="showOptions">
        <Divider>选项 / 状态映射</Divider>
        <OptionsEditor
          :model-value="col.options ?? []"
          @update:model-value="(v) => patch({ options: v })"
        />
      </template>

      <!-- 子表格嵌套列 -->
      <template v-if="col.type === 'subtable'">
        <Divider>嵌套子表格列</Divider>
        <NestedColumnsEditor
          :model-value="col.children ?? []"
          @update:model-value="(v) => patch({ children: v })"
        />
      </template>
    </Form>
  </div>
</template>

<style scoped lang="less">
.prop-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}
.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.prop-form :deep(.ant-form-item) {
  margin-bottom: 14px;
}
.switch-row {
  margin-bottom: 14px;
}
</style>
