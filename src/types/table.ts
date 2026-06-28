import type { SelectOption } from './schema'

/** 列数据类型 */
export type ColumnType = 'text' | 'number' | 'date' | 'tag' | 'money' | 'subtable'

/** 搜索控件类型 */
export type SearchControlType = 'input' | 'select' | 'date' | 'dateRange'

/** 行操作类型 */
export type RowActionType = 'detail' | 'edit' | 'delete'

/** 单列配置 */
export interface TableColumnSchema {
  id: string
  field: string
  title: string
  type: ColumnType
  width?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  /** tag 类型的取值 → 颜色映射，同时作为可选项来源 */
  options?: SelectOption[]
  /** 是否作为搜索条件 */
  searchable?: boolean
  /** 搜索控件类型 */
  searchType?: SearchControlType
  /** 搜索时传给后端的参数名（默认同 field） */
  searchParam?: string
  /** 搜索栏栅格宽度（1-24，默认 8） */
  searchSpan?: number
  /** subtable 类型的子列（表格内嵌表格） */
  children?: TableColumnSchema[]
}

/** 行操作按钮 */
export interface RowActionSchema {
  key: string
  label: string
  action: RowActionType
  danger?: boolean
}

/** 完整表格 Schema */
export interface TableSchema {
  version: '1.0'
  title: string
  description?: string
  columns: TableColumnSchema[]
  pagination: {
    enabled: boolean
    pageSize: number
  }
  actions: RowActionSchema[]
}

export type TableDesignerMode = 'design' | 'preview'
