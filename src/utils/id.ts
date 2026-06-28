let seed = 0

/** 生成全局唯一 id（用于字段 id） */
export function genId(prefix = 'fld'): string {
  seed += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}_${seed}_${rand}`
}

/** 生成默认字段名，保证不为空 */
export function genFieldName(type: string): string {
  seed += 1
  return `${type}_${seed}`
}
