<script setup lang="ts">
import { Button, Dropdown, Menu, MenuItem, message, Modal, Space } from 'ant-design-vue'
import {
  ClearOutlined,
  CopyOutlined,
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  TableOutlined,
} from '@ant-design/icons-vue'
import { useTableDesignerStore } from '@/stores/tableDesigner'
import { TABLE_TEMPLATES } from '@/constants/tableTemplates'
import { downloadText } from '@/utils/download'

const store = useTableDesignerStore()

function togglePreview(): void {
  store.setMode(store.mode === 'design' ? 'preview' : 'design')
}

function handleExport(): void {
  downloadText(`${store.schema.title || 'table'}.json`, JSON.stringify(store.schema, null, 2))
  message.success('已导出表格配置')
}

async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(JSON.stringify(store.schema, null, 2))
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败')
  }
}

function applyTemplate(key: string): void {
  const tpl = TABLE_TEMPLATES.find((t) => t.key === key)
  if (tpl) {
    store.setSchema(tpl.schema)
    message.success(`已套用模板：${tpl.name}`)
  }
}

function handleClear(): void {
  Modal.confirm({
    title: '确认清空表格配置？',
    okText: '清空',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      store.resetSchema()
      message.success('已清空')
    },
  })
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <TableOutlined class="logo-icon" />
      <span class="logo-text">表格设计器</span>
    </div>

    <Space>
      <Dropdown>
        <Button>模板 <DownOutlined /></Button>
        <template #overlay>
          <Menu @click="({ key }) => applyTemplate(key as string)">
            <MenuItem v-for="tpl in TABLE_TEMPLATES" :key="tpl.key">{{ tpl.name }}</MenuItem>
          </Menu>
        </template>
      </Dropdown>

      <Button :type="store.mode === 'preview' ? 'primary' : 'default'" @click="togglePreview">
        <template #icon><EyeOutlined /></template>
        {{ store.mode === 'preview' ? '退出预览' : '预览' }}
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
}
</style>
