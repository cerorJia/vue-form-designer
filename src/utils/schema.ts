import type { FormFieldSchema, FormSchema } from '@/types/schema'

const VALID_TYPES = [
  'input',
  'textarea',
  'number',
  'select',
  'radio',
  'checkbox',
  'date',
  'switch',
  'divider',
]

/** 深拷贝（结构化克隆，避免引用共享） */
export function cloneSchema<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T
}

/** 导出为格式化 JSON 字符串 */
export function exportSchema(schema: FormSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * 校验 schema 结构合法性。
 * 失败时抛出带友好提示的 Error。
 */
export function validateSchema(data: unknown): asserts data is FormSchema {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Schema 必须是一个对象')
  }
  const obj = data as Record<string, unknown>

  if (obj.version !== '1.0') {
    throw new Error('Schema 版本号必须为 "1.0"')
  }
  if (typeof obj.title !== 'string') {
    throw new Error('Schema 缺少有效的 title')
  }
  if (!Array.isArray(obj.fields)) {
    throw new Error('Schema 的 fields 必须是数组')
  }

  const seen = new Set<string>()
  for (const raw of obj.fields as unknown[]) {
    if (typeof raw !== 'object' || raw === null) {
      throw new Error('每个字段必须是对象')
    }
    const f = raw as Record<string, unknown>
    if (typeof f.id !== 'string' || !f.id) {
      throw new Error('字段缺少 id')
    }
    if (typeof f.type !== 'string' || !VALID_TYPES.includes(f.type)) {
      throw new Error(`字段 ${String(f.field)} 的 type 非法：${String(f.type)}`)
    }
    // divider 不需要 field 名
    if (f.type !== 'divider') {
      if (typeof f.field !== 'string' || !f.field) {
        throw new Error('字段缺少 field 名')
      }
      if (seen.has(f.field as string)) {
        throw new Error(`字段名重复：${String(f.field)}`)
      }
      seen.add(f.field as string)
    }
  }
}

/** 从 JSON 字符串导入并校验 */
export function importSchema(json: string): FormSchema {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('JSON 解析失败，请检查格式')
  }
  validateSchema(parsed)
  return parsed
}

/** 收集表单的默认值对象 */
export function buildDefaultValues(fields: FormFieldSchema[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.type === 'divider') continue
    if (field.defaultValue !== undefined) {
      values[field.field] = field.defaultValue
    } else if (field.type === 'checkbox') {
      values[field.field] = []
    } else if (field.type === 'switch') {
      values[field.field] = false
    } else {
      values[field.field] = undefined
    }
  }
  return values
}
