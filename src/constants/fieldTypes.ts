import type { FieldType, FormFieldSchema } from '@/types/schema'
import { genFieldName, genId } from '@/utils/id'

export interface FieldMeta {
  type: FieldType
  /** 组件面板显示名 */
  label: string
  /** Ant Design 图标组件名 */
  icon: string
  /** 是否为录入型字段（divider 这类非录入返回 false） */
  isDataField: boolean
  /** 创建一个默认字段配置 */
  create: () => FormFieldSchema
}

function base(type: FieldType, label: string): FormFieldSchema {
  return {
    id: genId(),
    type,
    field: genFieldName(type),
    label,
    span: 24,
    required: false,
  }
}

export const FIELD_META: Record<FieldType, FieldMeta> = {
  input: {
    type: 'input',
    label: '单行输入',
    icon: 'EditOutlined',
    isDataField: true,
    create: () => ({ ...base('input', '单行输入'), placeholder: '请输入' }),
  },
  textarea: {
    type: 'textarea',
    label: '多行文本',
    icon: 'AlignLeftOutlined',
    isDataField: true,
    create: () => ({
      ...base('textarea', '多行文本'),
      placeholder: '请输入',
      props: { rows: 3 },
    }),
  },
  number: {
    type: 'number',
    label: '数字',
    icon: 'FieldNumberOutlined',
    isDataField: true,
    create: () => ({
      ...base('number', '数字'),
      placeholder: '请输入数字',
      props: { min: undefined, max: undefined, step: 1 },
    }),
  },
  select: {
    type: 'select',
    label: '下拉选择',
    icon: 'DownSquareOutlined',
    isDataField: true,
    create: () => ({
      ...base('select', '下拉选择'),
      placeholder: '请选择',
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
      ],
    }),
  },
  radio: {
    type: 'radio',
    label: '单选',
    icon: 'CheckCircleOutlined',
    isDataField: true,
    create: () => ({
      ...base('radio', '单选'),
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
      ],
    }),
  },
  checkbox: {
    type: 'checkbox',
    label: '多选',
    icon: 'CheckSquareOutlined',
    isDataField: true,
    create: () => ({
      ...base('checkbox', '多选'),
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
      ],
    }),
  },
  date: {
    type: 'date',
    label: '日期',
    icon: 'CalendarOutlined',
    isDataField: true,
    create: () => ({
      ...base('date', '日期'),
      placeholder: '请选择日期',
      props: { format: 'YYYY-MM-DD', showTime: false },
    }),
  },
  switch: {
    type: 'switch',
    label: '开关',
    icon: 'SwapOutlined',
    isDataField: true,
    create: () => ({ ...base('switch', '开关'), defaultValue: false }),
  },
  divider: {
    type: 'divider',
    label: '分割线',
    icon: 'LineOutlined',
    isDataField: false,
    create: () => ({ id: genId(), type: 'divider', field: '', label: '分组标题', span: 24 }),
  },
}

/** 组件面板展示顺序 */
export const FIELD_PANEL_ORDER: FieldType[] = [
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
