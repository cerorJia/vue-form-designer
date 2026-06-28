import type { FormSchema } from '@/types/schema'

const STORAGE_KEY = 'vue-form-designer:schema'

/** 持久化当前设计中的 schema 到 LocalStorage */
export function saveSchemaToStorage(schema: FormSchema): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema))
  } catch {
    // 忽略隐私模式 / 容量超限
  }
}

/** 读取上次保存的 schema */
export function loadSchemaFromStorage(): FormSchema | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FormSchema
  } catch {
    return null
  }
}

/** 清空本地存储 */
export function clearSchemaStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
