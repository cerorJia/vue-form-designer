<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Space, Table, Tag } from 'ant-design-vue'
import type { TableColumnSchema, TableSchema } from '@/types/table'
import { buildAntColumns, findSubtableColumn } from '@/composables/useTableColumns'
import { genTableData } from '@/utils/mockTable'
import TableSearchBar from './TableSearchBar.vue'

const props = defineProps<{ schema: TableSchema }>()

const TAG_COLORS = ['blue', 'green', 'orange', 'red', 'purple', 'cyan']

const allData = ref<Record<string, unknown>[]>([])
const searchParams = ref<Record<string, unknown>>({})

function regenerate(): void {
  allData.value = genTableData(props.schema)
  searchParams.value = {}
}

watch(() => props.schema, regenerate, { immediate: true, deep: true })

const filteredData = computed(() => {
  const params = searchParams.value
  const keys = Object.keys(params)
  if (!keys.length) return allData.value
  return allData.value.filter((row) =>
    props.schema.columns.every((col) => {
      if (!col.searchable) return true
      const param = col.searchParam || col.field
      if (col.searchType === 'dateRange') {
        const start = params[`${param}Start`] as string | undefined
        const end = params[`${param}End`] as string | undefined
        const v = row[col.field] as string | undefined
        if (start && (!v || v < start)) return false
        if (end && (!v || v > end)) return false
        return true
      }
      const pv = params[param]
      if (pv === undefined || pv === '') return true
      const rv = row[col.field]
      if (col.searchType === 'input') return String(rv ?? '').includes(String(pv))
      return String(rv ?? '') === String(pv)
    }),
  )
})

const antColumns = computed(() => {
  const cols = buildAntColumns(props.schema.columns)
  if (props.schema.actions.length) {
    cols.push({ title: '操作', key: '__action', width: 160, fixed: 'right' })
  }
  return cols
})

const subtableCol = computed(() => findSubtableColumn(props.schema.columns))

const pagination = computed(() =>
  props.schema.pagination.enabled
    ? { pageSize: props.schema.pagination.pageSize, showSizeChanger: true }
    : false,
)

function tagText(col: TableColumnSchema, value: unknown): string {
  const opt = col.options?.find((o) => String(o.value) === String(value))
  return opt ? opt.label : String(value ?? '')
}

function tagColor(col: TableColumnSchema, value: unknown): string {
  const idx = col.options?.findIndex((o) => String(o.value) === String(value)) ?? 0
  return TAG_COLORS[(idx < 0 ? 0 : idx) % TAG_COLORS.length]
}

function colByField(field: string): TableColumnSchema | undefined {
  return props.schema.columns.find((c) => c.field === field)
}

function subAntColumns(col: TableColumnSchema) {
  return (col.children ?? []).map((c) => ({
    title: c.title,
    dataIndex: c.field,
    key: c.field,
    align: c.align ?? 'left',
  }))
}

defineExpose({ regenerate })
</script>

<template>
  <div class="table-renderer">
    <TableSearchBar
      :columns="schema.columns"
      @search="(p) => (searchParams = p)"
    />

    <Table
      :columns="antColumns"
      :data-source="filteredData"
      :pagination="pagination"
      row-key="__key"
      size="middle"
      bordered
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === '__action'">
          <Space>
            <Button
              v-for="act in schema.actions"
              :key="act.key"
              type="link"
              size="small"
              :danger="act.danger"
            >
              {{ act.label }}
            </Button>
          </Space>
        </template>

        <template v-else-if="colByField(column.key as string)?.type === 'tag'">
          <Tag :color="tagColor(colByField(column.key as string)!, text)">
            {{ tagText(colByField(column.key as string)!, text) }}
          </Tag>
        </template>

        <template v-else-if="colByField(column.key as string)?.type === 'money'">
          ￥{{ text }}
        </template>

        <template v-else>{{ text }}</template>
      </template>

      <template v-if="subtableCol" #expandedRowRender="{ record }">
        <div class="sub-table-wrap">
          <div class="sub-title">{{ subtableCol.title }}</div>
          <Table
            :columns="subAntColumns(subtableCol)"
            :data-source="(record[subtableCol.field] as Record<string, unknown>[]) ?? []"
            :pagination="false"
            size="small"
            bordered
            row-key="__key"
          />
        </div>
      </template>
    </Table>
  </div>
</template>

<style scoped lang="less">
.table-renderer {
  padding: 4px;
}
.sub-table-wrap {
  padding: 8px 0;
}
.sub-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: #4e5969;
}
</style>
