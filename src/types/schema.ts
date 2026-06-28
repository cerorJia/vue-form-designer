/** 字段类型枚举（表单字段，不含表格） */
export type FieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'switch'
  | 'divider'

/** 下拉/单选/多选选项 */
export interface SelectOption {
  label: string
  value: string | number
}

/** 校验规则（贴近 async-validator） */
export interface ValidationRule {
  type?: 'string' | 'number' | 'email' | 'url'
  required?: boolean
  min?: number
  max?: number
  pattern?: string
  message?: string
}

/** 单个字段配置 */
export interface FormFieldSchema {
  /** 唯一标识，用于拖拽与选中 */
  id: string
  type: FieldType
  /** 表单字段名，如 patientName */
  field: string
  label: string
  placeholder?: string
  defaultValue?: unknown
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  /** 栅格占位 1-24 */
  span?: number
  /** 组件特有属性，如 number 的 min/max、date 的 format */
  props?: Record<string, unknown>
  /** 校验规则 */
  rules?: ValidationRule[]
  /** select/radio/checkbox 选项 */
  options?: SelectOption[]
}

/** 完整表单 Schema */
export interface FormSchema {
  version: '1.0'
  title: string
  description?: string
  fields: FormFieldSchema[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: number
}

/** 设计器模式 */
export type DesignerMode = 'design' | 'preview'
