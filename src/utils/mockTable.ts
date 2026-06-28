import type { TableColumnSchema, TableSchema } from '@/types/table'

const SAMPLE_NAMES = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
const SAMPLE_TEXTS = ['示例数据', '测试内容', '记录项', '条目', '数据行']

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function randomDate(): string {
  const month = 1 + Math.floor(Math.random() * 12)
  const day = 1 + Math.floor(Math.random() * 28)
  return `2025-${pad(month)}-${pad(day)}`
}

/** 为单列生成一个示例值 */
function genCellValue(col: TableColumnSchema, rowIndex: number): unknown {
  switch (col.type) {
    case 'number':
      return Math.floor(Math.random() * 1000)
    case 'money':
      return (Math.random() * 5000).toFixed(2)
    case 'date':
      return randomDate()
    case 'tag': {
      const opts = col.options ?? []
      if (opts.length) return opts[rowIndex % opts.length].value
      return '默认'
    }
    case 'subtable':
      return genRows(col.children ?? [], 2 + Math.floor(Math.random() * 3))
    case 'text':
    default:
      if (col.field.includes('name') || col.title.includes('姓名'))
        return SAMPLE_NAMES[rowIndex % SAMPLE_NAMES.length]
      if (col.field.includes('mrn') || col.title.includes('号'))
        return `NO${100000 + rowIndex}`
      return `${SAMPLE_TEXTS[rowIndex % SAMPLE_TEXTS.length]}${rowIndex + 1}`
  }
}

/** 按列定义生成 N 行数据 */
export function genRows(
  columns: TableColumnSchema[],
  count: number,
): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = []
  for (let i = 0; i < count; i++) {
    const row: Record<string, unknown> = { __key: `row_${i}_${Math.random().toString(36).slice(2, 6)}` }
    for (const col of columns) {
      row[col.field] = genCellValue(col, i)
    }
    rows.push(row)
  }
  return rows
}

/** 为整张表生成 Mock 数据集 */
export function genTableData(schema: TableSchema, count = 53): Record<string, unknown>[] {
  return genRows(schema.columns, count)
}
