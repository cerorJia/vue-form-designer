# Low-Code Form Designer — Vue Form Designer

A visual low-code form designer built with **Vue 3 + TypeScript + Ant Design Vue**: drag-and-drop form building, JSON Schema import/export, runtime rendering, and validation. Abstracted from experience building dynamic form engines in HIS (Hospital Information System) medical software.

> Live Demo: _Coming soon_ | Source: _Open source pending_

---

## ✨ Features

- **Visual design**: Add components from the left panel, drag to reorder on the canvas, edit properties in real time on the right
- **10 field types**: Single-line input, multi-line text, number, select, radio, checkbox, date, switch, divider, subform
- **Property configuration**: Field name, label, placeholder, required, grid span, options, number range, date format
- **Runtime rendering**: `FormRenderer` renders from Schema with built-in async-validator validation
- **Design / Preview** dual-mode toggle; preview mode supports submit and `formData` inspection
- **JSON interchange**: Export to file, copy to clipboard, paste to import (with structure validation)
- **Local persistence**: Edits auto-saved to LocalStorage; survives page refresh
- **Preset templates**: Patient registration form, employee information form — ready to use out of the box
- **Subforms**: Table-style fields with add/remove rows

---

## 🛠 Tech Stack

| Category | Choice |
|----------|--------|
| Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Language | TypeScript 5 |
| Build | Vite 6 |
| State | Pinia |
| UI | Ant Design Vue 4 |
| Drag & drop | vue-draggable-plus |
| Testing | Vitest + @vue/test-utils |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Local development (default http://localhost:5173)
npm run dev

```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── designer/        # Designer: toolbar, component panel, canvas, property panel, option editor
│   ├── renderer/        # Render engine: FormRenderer, FieldControl, SubformControl
│   └── common/          # JSON import dialog
├── composables/         # useFormRules (schema → validation rules)
├── constants/           # Field metadata, empty form, preset templates
├── stores/              # Pinia designer state
├── types/               # FormSchema / FormFieldSchema types
├── utils/               # schema validate/import-export, id, storage, download
└── views/               # DesignerView (main page), PreviewPane (preview)
```

---

## 🧩 Core Data Model

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
  field: string          // form field name
  label: string
  required?: boolean
  span?: number          // grid span 1-24
  options?: SelectOption[]
  rules?: ValidationRule[]
  children?: FormFieldSchema[]  // subform fields
  // ...
}
```

---

## 💡 Design Highlights

1. **Schema-driven**: Design-time and runtime share the same `FormSchema` — serializable and backend-consumable
2. **Single source of truth**: Pinia holds schema and selection state; property panel derives via computed; deep watch auto-persists
3. **Extensible rendering**: `FieldControl` maps controls by `type`; adding a field type only requires extending metadata + one branch
4. **Auto-generated validation**: `buildRules` produces Ant Design Form rules from field configuration

---

## 🗺 Roadmap

- [ ] Field linkage (show B when A has a certain value)
- [ ] Undo / redo (Command pattern)
- [ ] AI assist: natural language → form Schema
- [ ] Backend integration for template persistence
- [ ] Deploy to Vercel and add demo GIF

---

## 📄 License

MIT
