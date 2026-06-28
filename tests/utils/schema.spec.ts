import { describe, expect, it } from 'vitest'
import {
  buildDefaultValues,
  cloneSchema,
  exportSchema,
  importSchema,
  validateSchema,
} from '@/utils/schema'
import type { FormSchema } from '@/types/schema'

const validSchema: FormSchema = {
  version: '1.0',
  title: '测试表单',
  layout: 'horizontal',
  fields: [
    { id: 'a', type: 'input', field: 'name', label: '姓名', required: true },
    { id: 'b', type: 'switch', field: 'active', label: '启用' },
    { id: 'c', type: 'checkbox', field: 'tags', label: '标签' },
    { id: 'd', type: 'divider', field: '', label: '分组' },
  ] as FormSchema['fields'],
}

describe('validateSchema', () => {
  it('通过合法 schema', () => {
    expect(() => validateSchema(validSchema)).not.toThrow()
  })

  it('版本号非法时抛错', () => {
    expect(() => validateSchema({ ...validSchema, version: '2.0' })).toThrow(/版本号/)
  })

  it('fields 非数组时抛错', () => {
    expect(() => validateSchema({ ...validSchema, fields: {} })).toThrow(/fields/)
  })

  it('字段名重复时抛错', () => {
    const dup = {
      ...validSchema,
      fields: [
        { id: '1', type: 'input', field: 'x', label: 'X' },
        { id: '2', type: 'input', field: 'x', label: 'X2' },
      ],
    }
    expect(() => validateSchema(dup)).toThrow(/重复/)
  })

  it('字段类型非法时抛错', () => {
    const bad = {
      ...validSchema,
      fields: [{ id: '1', type: 'unknown', field: 'x', label: 'X' }],
    }
    expect(() => validateSchema(bad)).toThrow(/type/)
  })
})

describe('importSchema / exportSchema', () => {
  it('导出再导入应等价', () => {
    const json = exportSchema(validSchema)
    const parsed = importSchema(json)
    expect(parsed).toEqual(validSchema)
  })

  it('非法 JSON 抛错', () => {
    expect(() => importSchema('{ not json')).toThrow(/JSON/)
  })
})

describe('cloneSchema', () => {
  it('深拷贝且不共享引用', () => {
    const copy = cloneSchema(validSchema)
    copy.fields[0].label = '改了'
    expect(validSchema.fields[0].label).toBe('姓名')
  })
})

describe('buildDefaultValues', () => {
  it('按类型生成默认值', () => {
    const values = buildDefaultValues(validSchema.fields)
    expect(values.active).toBe(false)
    expect(values.tags).toEqual([])
    expect('name' in values).toBe(true)
    // divider 不产生数据字段
    expect(Object.keys(values)).not.toContain('')
  })
})
