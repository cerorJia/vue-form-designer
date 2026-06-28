<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dropdown, Menu, MenuItem, message, Modal, Space } from 'ant-design-vue'
import {
  ClearOutlined,
  CopyOutlined,
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  FormOutlined,
  ImportOutlined,
} from '@ant-design/icons-vue'
import { useDesignerStore } from '@/stores/designer'
import { TEMPLATES } from '@/constants/templates'
import { exportSchema } from '@/utils/schema'
import { downloadText } from '@/utils/download'
import type { FormSchema } from '@/types/schema'
import JsonModal from '@/components/common/JsonModal.vue'

const store = useDesignerStore()
const importOpen = ref(false)

function togglePreview(): void {
  store.setMode(store.mode === 'design' ? 'preview' : 'design')
}

function handleExport(): void {
  downloadText(`${store.schema.title || 'form'}.json`, exportSchema(store.schema))
  message.success('已导出 JSON 文件')
}

async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(exportSchema(store.schema))
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败，请手动导出')
  }
}

function handleImport(schema: FormSchema): void {
  store.setSchema(schema)
}

function applyTemplate(key: string): void {
  const tpl = TEMPLATES.find((t) => t.key === key)
  if (tpl) {
    store.setSchema(tpl.schema)
    message.success(`已套用模板：${tpl.name}`)
  }
}

function handleClear(): void {
  Modal.confirm({
    title: '确认清空画布？',
    content: '当前表单配置将被清除，此操作不可撤销。',
    okText: '清空',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      store.resetSchema()
      message.success('画布已清空')
    },
  })
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <FormOutlined class="logo-icon" />
      <span class="logo-text">低代码表单设计器</span>
    </div>

    <Space>
      <Dropdown>
        <Button>
          模板
          <DownOutlined />
        </Button>
        <template #overlay>
          <Menu @click="({ key }) => applyTemplate(key as string)">
            <MenuItem v-for="tpl in TEMPLATES" :key="tpl.key">
              {{ tpl.name }}
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>

      <Button :type="store.mode === 'preview' ? 'primary' : 'default'" @click="togglePreview">
        <template #icon><EyeOutlined /></template>
        {{ store.mode === 'preview' ? '退出预览' : '预览' }}
      </Button>

      <Button @click="importOpen = true">
        <template #icon><ImportOutlined /></template>
        导入
      </Button>

      <Button @click="handleExport">
        <template #icon><DownloadOutlined /></template>
        导出
      </Button>

      <Button @click="handleCopy">
        <template #icon><CopyOutlined /></template>
        复制
      </Button>

      <Button danger @click="handleClear">
        <template #icon><ClearOutlined /></template>
        清空
      </Button>
    </Space>

    <JsonModal v-model:open="importOpen" @import="handleImport" />
  </div>
</template>

<style scoped lang="less">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e5e6eb;
}
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-icon {
  font-size: 20px;
  color: #1677ff;
}
.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}
</style>
