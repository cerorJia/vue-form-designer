import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { DesignerMode, FieldType, FormFieldSchema, FormSchema } from '@/types/schema'
import { FIELD_META } from '@/constants/fieldTypes'
import { createEmptySchema } from '@/constants/defaultSchema'
import { cloneSchema } from '@/utils/schema'
import { loadSchemaFromStorage, saveSchemaToStorage } from '@/utils/storage'

export const useDesignerStore = defineStore('designer', () => {
  const schema = ref<FormSchema>(loadSchemaFromStorage() ?? createEmptySchema())
  const activeFieldId = ref<string | null>(null)
  const mode = ref<DesignerMode>('design')

  const activeField = computed<FormFieldSchema | null>(
    () => schema.value.fields.find((f) => f.id === activeFieldId.value) ?? null,
  )

  const fieldCount = computed(() => schema.value.fields.length)

  /** 末尾追加一个字段 */
  function addField(type: FieldType, index?: number): void {
    const field = FIELD_META[type].create()
    if (index === undefined || index < 0 || index >= schema.value.fields.length) {
      schema.value.fields.push(field)
    } else {
      schema.value.fields.splice(index, 0, field)
    }
    activeFieldId.value = field.id
  }

  /** 局部更新某个字段 */
  function updateField(id: string, partial: Partial<FormFieldSchema>): void {
    const field = schema.value.fields.find((f) => f.id === id)
    if (field) Object.assign(field, partial)
  }

  /** 删除字段 */
  function removeField(id: string): void {
    const idx = schema.value.fields.findIndex((f) => f.id === id)
    if (idx !== -1) {
      schema.value.fields.splice(idx, 1)
      if (activeFieldId.value === id) activeFieldId.value = null
    }
  }

  /** 复制字段 */
  function duplicateField(id: string): void {
    const idx = schema.value.fields.findIndex((f) => f.id === id)
    if (idx === -1) return
    const source = schema.value.fields[idx]
    const copy = cloneSchema(source)
    copy.id = FIELD_META[source.type].create().id
    if (copy.field) copy.field = `${copy.field}_copy`
    schema.value.fields.splice(idx + 1, 0, copy)
    activeFieldId.value = copy.id
  }

  /** 选中字段 */
  function selectField(id: string | null): void {
    activeFieldId.value = id
  }

  /** 整体替换 fields（拖拽排序用） */
  function setFields(fields: FormFieldSchema[]): void {
    schema.value.fields = fields
  }

  /** 替换整个 schema（导入 / 套用模板） */
  function setSchema(next: FormSchema): void {
    schema.value = cloneSchema(next)
    activeFieldId.value = null
  }

  /** 清空画布 */
  function resetSchema(): void {
    schema.value = createEmptySchema()
    activeFieldId.value = null
  }

  function setMode(next: DesignerMode): void {
    mode.value = next
  }

  // 自动持久化（schema 变化即写入）
  watch(
    schema,
    (val) => saveSchemaToStorage(val),
    { deep: true },
  )

  return {
    schema,
    activeFieldId,
    activeField,
    mode,
    fieldCount,
    addField,
    updateField,
    removeField,
    duplicateField,
    selectField,
    setFields,
    setSchema,
    resetSchema,
    setMode,
  }
})
