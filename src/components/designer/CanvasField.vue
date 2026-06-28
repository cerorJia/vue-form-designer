<script setup lang="ts">
import { computed } from 'vue'
import { Divider, FormItem } from 'ant-design-vue'
import { CopyOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons-vue'
import type { FormFieldSchema } from '@/types/schema'
import FieldControl from '@/components/renderer/FieldControl.vue'

const props = defineProps<{ field: FormFieldSchema; active: boolean }>()
const emit = defineEmits<{
  select: []
  remove: []
  duplicate: []
}>()

const widthPercent = computed(() => `${((props.field.span ?? 24) / 24) * 100}%`)
</script>

<template>
  <div class="canvas-field-wrap" :style="{ width: widthPercent }">
    <div class="canvas-field" :class="{ active }" @click.stop="emit('select')">
      <span class="drag-handle"><HolderOutlined /></span>

      <div class="field-body">
        <Divider v-if="field.type === 'divider'" orientation="left">{{ field.label }}</Divider>
        <FormItem v-else :label="field.label" :required="field.required" :colon="false">
          <FieldControl :field="{ ...field, disabled: true }" :model-value="undefined" />
        </FormItem>
      </div>

      <div class="field-actions" @click.stop>
        <CopyOutlined class="action-icon" title="复制" @click="emit('duplicate')" />
        <DeleteOutlined class="action-icon danger" title="删除" @click="emit('remove')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.canvas-field-wrap {
  padding: 0 8px 12px;
  box-sizing: border-box;
}
.canvas-field {
  position: relative;
  padding: 8px 12px 0;
  border: 1px dashed transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
/* 画布内控件仅作预览展示，不响应鼠标交互（避免划入/聚焦干扰选中与拖拽） */
.field-body {
  pointer-events: none;
}
.canvas-field:hover {
  border-color: #91caff;
  background: #f7fbff;
}
.canvas-field.active {
  border-color: #1677ff;
  border-style: solid;
  background: #f0f7ff;
}
.drag-handle {
  position: absolute;
  left: -14px;
  top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #1677ff;
  color: #fff;
  cursor: move;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.35);
  opacity: 0;
  transition: opacity 0.15s;
}
.canvas-field:hover .drag-handle,
.canvas-field.active .drag-handle {
  opacity: 1;
}
.drag-handle:hover {
  background: #4096ff;
}
.field-actions {
  position: absolute;
  right: 8px;
  top: 6px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s;
}
.canvas-field:hover .field-actions,
.canvas-field.active .field-actions {
  opacity: 1;
}
.action-icon {
  font-size: 14px;
  color: #8c8c8c;
}
.action-icon:hover {
  color: #1677ff;
}
.action-icon.danger:hover {
  color: #ff4d4f;
}
</style>
