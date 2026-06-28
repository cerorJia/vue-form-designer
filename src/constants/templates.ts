import type { FormSchema } from '@/types/schema'

export interface TemplateMeta {
  key: string
  name: string
  description: string
  schema: FormSchema
}

/** 患者信息登记表（医疗场景，呼应 HIS 经历） */
const patientTemplate: FormSchema = {
  version: '1.0',
  title: '患者信息登记表',
  description: '门诊患者基本信息录入',
  layout: 'horizontal',
  labelWidth: 100,
  fields: [
    {
      id: 'p_name',
      type: 'input',
      field: 'patientName',
      label: '姓名',
      placeholder: '请输入患者姓名',
      required: true,
      span: 12,
    },
    {
      id: 'p_gender',
      type: 'radio',
      field: 'gender',
      label: '性别',
      required: true,
      span: 12,
      options: [
        { label: '男', value: 'M' },
        { label: '女', value: 'F' },
      ],
    },
    {
      id: 'p_birthday',
      type: 'date',
      field: 'birthday',
      label: '出生日期',
      span: 12,
      props: { format: 'YYYY-MM-DD', showTime: false },
    },
    {
      id: 'p_dept',
      type: 'select',
      field: 'department',
      label: '就诊科室',
      placeholder: '请选择科室',
      required: true,
      span: 12,
      options: [
        { label: '内科', value: 'internal' },
        { label: '外科', value: 'surgery' },
        { label: '眼科', value: 'eye' },
        { label: '儿科', value: 'pediatrics' },
      ],
    },
    {
      id: 'p_phone',
      type: 'input',
      field: 'phone',
      label: '联系电话',
      placeholder: '请输入手机号',
      span: 12,
      rules: [{ pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' }],
    },
    {
      id: 'p_allergy',
      type: 'textarea',
      field: 'allergy',
      label: '过敏史',
      placeholder: '无则填「无」',
      span: 24,
      props: { rows: 3 },
    },
  ],
}

/** 员工信息表（通用 ToB 场景） */
const employeeTemplate: FormSchema = {
  version: '1.0',
  title: '员工信息表',
  description: '企业员工档案录入',
  layout: 'horizontal',
  labelWidth: 100,
  fields: [
    {
      id: 'e_name',
      type: 'input',
      field: 'name',
      label: '姓名',
      required: true,
      span: 12,
      placeholder: '请输入姓名',
    },
    {
      id: 'e_no',
      type: 'input',
      field: 'employeeNo',
      label: '工号',
      required: true,
      span: 12,
      placeholder: '请输入工号',
    },
    {
      id: 'e_dept',
      type: 'select',
      field: 'dept',
      label: '部门',
      span: 12,
      options: [
        { label: '研发部', value: 'rd' },
        { label: '产品部', value: 'product' },
        { label: '市场部', value: 'market' },
      ],
    },
    {
      id: 'e_entry',
      type: 'date',
      field: 'entryDate',
      label: '入职日期',
      span: 12,
      props: { format: 'YYYY-MM-DD', showTime: false },
    },
    {
      id: 'e_active',
      type: 'switch',
      field: 'active',
      label: '在职状态',
      span: 12,
      defaultValue: true,
    },
  ],
}

export const TEMPLATES: TemplateMeta[] = [
  {
    key: 'patient',
    name: '患者信息登记表',
    description: '医疗场景 · 含性别单选、科室下拉、过敏史',
    schema: patientTemplate,
  },
  {
    key: 'employee',
    name: '员工信息表',
    description: '通用场景 · 含部门、入职日期、在职开关',
    schema: employeeTemplate,
  },
]
