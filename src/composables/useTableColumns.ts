import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TableColumnSchema } from '@/types/table'

/** 将列 Schema 转为 Ant Design Table 的 columns 配置（不含操作列与渲染特例） */
export function buildAntColumns(columns: TableColumnSchema[]): ColumnsType {
  return columns
    .filter((c) => c.type !== 'subtable')
    .map((c) => ({
      title: c.title,
      dataIndex: c.field,
      key: c.field,
      width: c.width,
      align: c.align ?? 'left',
      fixed: c.fixed,
    }))
}

/** 找到第一个子表格列（用于行展开） */
export function findSubtableColumn(columns: TableColumnSchema[]): TableColumnSchema | undefined {
  return columns.find((c) => c.type === 'subtable')
}
