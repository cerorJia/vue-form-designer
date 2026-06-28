# 低代码表单设计器 Vue Form Designer

基于 **Vue 3 + TypeScript + Ant Design Vue** 的可视化低代码表单设计器：拖拽搭建表单、JSON Schema 导入导出、运行时渲染与校验。抽象自 HIS 医疗系统动态表单引擎经验。

> 在线 Demo：_待部署_ ｜ 源码：_待开源_

---

## ✨ 功能特性

- **可视化设计**：左侧组件库点击添加，中间画布拖拽排序，右侧实时编辑属性
- **10 种字段**：单行输入、多行文本、数字、下拉、单选、多选、日期、开关、分割线、子表单
- **属性配置**：字段名、标签、占位、必填、栅格宽度、选项、数字范围、日期格式
- **运行时渲染**：`FormRenderer` 接收 Schema 即渲染，内置 async-validator 校验
- **设计 / 预览** 双模式切换，预览态可提交并查看 `formData`
- **JSON 互转**：导出文件、复制剪贴板、粘贴导入（带结构校验）
- **本地持久化**：编辑内容自动存入 LocalStorage，刷新不丢失
- **预设模板**：患者信息登记表、员工信息表，开箱即用
- **子表单**：可增删行的表格型字段

---

## 🛠 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3.5（Composition API + `<script setup>`） |
| 语言 | TypeScript 5 |
| 构建 | Vite 6 |
| 状态 | Pinia |
| UI | Ant Design Vue 4 |
| 拖拽 | vue-draggable-plus |
| 测试 | Vitest + @vue/test-utils |

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run dev

```

---

## 📁 目录结构

```
src/
├── components/
│   ├── designer/        # 设计器：工具栏、组件面板、画布、属性面板、选项编辑
│   ├── renderer/        # 渲染引擎：FormRenderer、FieldControl、SubformControl
│   └── common/          # JSON 导入弹窗
├── composables/         # useFormRules（schema → 校验规则）
├── constants/           # 字段元信息、空表单、预设模板
├── stores/              # Pinia 设计器状态
├── types/               # FormSchema / FormFieldSchema 类型
├── utils/               # schema 校验/导入导出、id、storage、download
└── views/               # DesignerView（主页）、PreviewPane（预览）
```

---

## 🧩 核心数据模型

```typescript
interface FormSchema {
  version: '1.0'
  title: string
  description?: string
  fields: FormFieldSchema[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: number
}

interface FormFieldSchema {
  id: string
  type: FieldType        // input | select | date | switch | subform ...
  field: string          // 表单字段名
  label: string
  required?: boolean
  span?: number          // 栅格 1-24
  options?: SelectOption[]
  rules?: ValidationRule[]
  children?: FormFieldSchema[]  // 子表单
  // ...
}
```

---

## 💡 设计要点

1. **Schema 驱动**：设计态与运行态共用同一份 `FormSchema`，可序列化、可被后端消费
2. **状态单一来源**：Pinia 持有 schema 与选中态，属性面板用 computed 派生，深度 watch 自动持久化
3. **渲染可扩展**：`FieldControl` 按 `type` 映射控件，新增字段类型只需扩展元信息 + 一个分支
4. **校验自动生成**：`buildRules` 从字段配置生成 Ant Design Form 规则

---

## 🗺 后续规划

- [ ] 字段联动（A 选某值时显示 B）
- [ ] 撤销 / 重做（Command 模式）
- [ ] AI 辅助：自然语言生成表单 Schema
- [ ] 对接后端保存模板
- [ ] 部署 Vercel 并补充演示 GIF

---

## 📄 License

MIT

---

English: [README.en.md](./README.en.md)
