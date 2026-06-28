import type { Rule } from 'ant-design-vue/es/form'
import type { FormFieldSchema } from '@/types/schema'

/** 由字段 schema 生成 Ant Design Form 的校验规则表 */
export function buildRules(fields: FormFieldSchema[]): Record<string, Rule[]> {
  const rulesMap: Record<string, Rule[]> = {}

  for (const field of fields) {
    if (field.type === 'divider' || !field.field) continue
    const rules: Rule[] = []

    if (field.required) {
      const isArrayLike = field.type === 'checkbox'
      rules.push({
        required: true,
        type: isArrayLike ? 'array' : undefined,
        message: `${field.label}不能为空`,
        trigger: ['change', 'blur'],
      } as Rule)
    }

    for (const r of field.rules ?? []) {
      const rule: Rule = { trigger: ['change', 'blur'] }
      if (r.required) rule.required = true
      if (r.type) rule.type = r.type
      if (r.min !== undefined) rule.min = r.min
      if (r.max !== undefined) rule.max = r.max
      if (r.pattern) rule.pattern = new RegExp(r.pattern)
      rule.message = r.message ?? `${field.label}格式不正确`
      rules.push(rule)
    }

    if (rules.length) rulesMap[field.field] = rules
  }

  return rulesMap
}
