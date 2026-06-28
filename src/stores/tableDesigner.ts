import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  ColumnType,
  TableColumnSchema,
  TableDesignerMode,
  TableSchema,
} from '@/types/table'
import { COLUMN_TYPE_META, createEmptyTableSchema } from '@/constants/columnTypes'
import { cloneSchema } from '@/utils/schema'

const STORAGE_KEY = 'vue-form-designer:table-schema'

function loadFromStorage(): TableSchema | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TableSchema) : null
  } catch {
    return null
  }
}

export const useTableDesignerStore = defineStore('tableDesigner', () => {
  const schema = ref<TableSchema>(loadFromStorage() ?? createEmptyTableSchema())
  const activeColumnId = ref<string | null>(null)
  const mode = ref<TableDesignerMode>('design')

  const activeColumn = computed<TableColumnSchema | null>(
    () => schema.value.columns.find((c) => c.id === activeColumnId.value) ?? null,
  )

  function addColumn(type: ColumnType): void {
    const col = COLUMN_TYPE_META[type].create()
    schema.value.columns.push(col)
    activeColumnId.value = col.id
  }

  function updateColumn(id: string, partial: Partial<TableColumnSchema>): void {
    const col = schema.value.columns.find((c) => c.id === id)
    if (col) Object.assign(col, partial)
  }

  function removeColumn(id: string): void {
    const idx = schema.value.columns.findIndex((c) => c.id === id)
    if (idx !== -1) {
      schema.value.columns.splice(idx, 1)
      if (activeColumnId.value === id) activeColumnId.value = null
    }
  }

  function duplicateColumn(id: string): void {
    const idx = schema.value.columns.findIndex((c) => c.id === id)
    if (idx === -1) return
    const copy = cloneSchema(schema.value.columns[idx])
    copy.id = COLUMN_TYPE_META[copy.type].create().id
    copy.field = `${copy.field}_copy`
    schema.value.columns.splice(idx + 1, 0, copy)
    activeColumnId.value = copy.id
  }

  function selectColumn(id: string | null): void {
    activeColumnId.value = id
  }

  function setColumns(columns: TableColumnSchema[]): void {
    schema.value.columns = columns
  }

  function setSchema(next: TableSchema): void {
    schema.value = cloneSchema(next)
    activeColumnId.value = null
  }

  function resetSchema(): void {
    schema.value = createEmptyTableSchema()
    activeColumnId.value = null
  }

  function setMode(next: TableDesignerMode): void {
    mode.value = next
  }

  watch(
    schema,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // ignore
      }
    },
    { deep: true },
  )

  return {
    schema,
    activeColumnId,
    activeColumn,
    mode,
    addColumn,
    updateColumn,
    removeColumn,
    duplicateColumn,
    selectColumn,
    setColumns,
    setSchema,
    resetSchema,
    setMode,
  }
})
