import type { FormSchema } from '@/types/schema'

/** 空表单初始 schema */
export function createEmptySchema(): FormSchema {
  return {
    version: '1.0',
    title: '未命名表单',
    description: '',
    fields: [],
    layout: 'horizontal',
    labelWidth: 100,
  }
}
