import type { ColumnType, TableColumnSchema, TableSchema } from '@/types/table'
import { genFieldName, genId } from '@/utils/id'

export interface ColumnTypeMeta {
  type: ColumnType
  label: string
  icon: string
  create: () => TableColumnSchema
}

function base(type: ColumnType, title: string): TableColumnSchema {
  return {
    id: genId('col'),
    type,
    field: genFieldName(type),
    title,
    align: 'left',
    searchable: false,
  }
}

export const COLUMN_TYPE_META: Record<ColumnType, ColumnTypeMeta> = {
  text: {
    type: 'text',
    label: '文本',
    icon: 'FontSizeOutlined',
    create: () => ({ ...base('text', '文本列'), searchable: true, searchType: 'input' }),
  },
  number: {
    type: 'number',
    label: '数字',
    icon: 'FieldNumberOutlined',
    create: () => ({ ...base('number', '数字列'), align: 'right' }),
  },
  date: {
    type: 'date',
    label: '日期',
    icon: 'CalendarOutlined',
    create: () => ({
      ...base('date', '日期列'),
      searchable: true,
      searchType: 'dateRange',
      searchSpan: 12,
    }),
  },
  tag: {
    type: 'tag',
    label: '状态标签',
    icon: 'TagOutlined',
    create: () => ({
      ...base('tag', '状态'),
      align: 'center',
      searchable: true,
      searchType: 'select',
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    }),
  },
  money: {
    type: 'money',
    label: '金额',
    icon: 'MoneyCollectOutlined',
    create: () => ({ ...base('money', '金额'), align: 'right' }),
  },
  subtable: {
    type: 'subtable',
    label: '子表格',
    icon: 'TableOutlined',
    create: () => ({
      ...base('subtable', '子表格'),
      children: [
        { ...base('text', '名称'), searchable: false },
        { ...base('number', '数量'), align: 'right', searchable: false },
      ],
    }),
  },
}

export const COLUMN_PANEL_ORDER: ColumnType[] = [
  'text',
  'number',
  'date',
  'tag',
  'money',
  'subtable',
]

/** 空表格初始 schema */
export function createEmptyTableSchema(): TableSchema {
  return {
    version: '1.0',
    title: '未命名表格',
    description: '',
    columns: [],
    pagination: { enabled: true, pageSize: 10 },
    actions: [
      { key: 'detail', label: '详情', action: 'detail' },
      { key: 'edit', label: '编辑', action: 'edit' },
      { key: 'delete', label: '删除', action: 'delete', danger: true },
    ],
  }
}
