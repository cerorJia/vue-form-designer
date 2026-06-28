import type { TableSchema } from '@/types/table'

/** 患者列表（医疗场景，呼应 HIS 经历） */
const patientTable: TableSchema = {
  version: '1.0',
  title: '患者列表',
  description: '门诊患者管理',
  pagination: { enabled: true, pageSize: 10 },
  columns: [
    { id: 'c1', field: 'mrn', title: '病历号', type: 'text', searchable: true, searchType: 'input' },
    {
      id: 'c2',
      field: 'name',
      title: '姓名',
      type: 'text',
      searchable: true,
      searchType: 'input',
    },
    {
      id: 'c3',
      field: 'gender',
      title: '性别',
      type: 'tag',
      align: 'center',
      searchable: true,
      searchType: 'select',
      options: [
        { label: '男', value: 'M' },
        { label: '女', value: 'F' },
      ],
    },
    {
      id: 'c4',
      field: 'dept',
      title: '科室',
      type: 'text',
      searchable: true,
      searchType: 'select',
      options: [
        { label: '内科', value: '内科' },
        { label: '外科', value: '外科' },
        { label: '眼科', value: '眼科' },
      ],
    },
    {
      id: 'c5',
      field: 'admitDate',
      title: '入院日期',
      type: 'date',
      searchable: true,
      searchType: 'dateRange',
      searchSpan: 12,
    },
    {
      id: 'c6',
      field: 'status',
      title: '状态',
      type: 'tag',
      align: 'center',
      searchable: true,
      searchType: 'select',
      options: [
        { label: '在院', value: '在院' },
        { label: '出院', value: '出院' },
      ],
    },
    {
      id: 'c7',
      field: 'visits',
      title: '就诊记录',
      type: 'subtable',
      children: [
        { id: 's1', field: 'visitDate', title: '就诊日期', type: 'date' },
        { id: 's2', field: 'doctor', title: '医生', type: 'text' },
        { id: 's3', field: 'fee', title: '费用', type: 'money', align: 'right' },
      ],
    },
  ],
  actions: [
    { key: 'detail', label: '详情', action: 'detail' },
    { key: 'edit', label: '编辑', action: 'edit' },
    { key: 'delete', label: '删除', action: 'delete', danger: true },
  ],
}

export interface TableTemplateMeta {
  key: string
  name: string
  schema: TableSchema
}

export const TABLE_TEMPLATES: TableTemplateMeta[] = [
  { key: 'patient', name: '患者列表（含嵌套就诊记录）', schema: patientTable },
]
