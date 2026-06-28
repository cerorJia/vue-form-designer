<script setup lang="ts">
import { computed } from 'vue'
import { Empty } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { FormFieldSchema } from '@/types/schema'
import { useDesignerStore } from '@/stores/designer'
import CanvasField from './CanvasField.vue'

const store = useDesignerStore()

const fields = computed<FormFieldSchema[]>({
  get: () => store.schema.fields,
  set: (val) => store.setFields(val),
})
</script>

<template>
  <div class="design-canvas" @click="store.selectField(null)">
    <div class="canvas-header">
      <span class="form-title">{{ store.schema.title }}</span>
      <span v-if="store.schema.description" class="form-desc">{{ store.schema.description }}</span>
    </div>

    <div class="canvas-body">
      <Empty
        v-if="!fields.length"
        description="点击左侧组件添加字段，拖动手柄可调整顺序"
        style="margin-top: 80px"
      />

      <VueDraggable
        v-else
        v-model="fields"
        :animation="150"
        handle=".drag-handle"
        class="canvas-fields"
      >
        <CanvasField
          v-for="field in fields"
          :key="field.id"
          :field="field"
          :active="store.activeFieldId === field.id"
          @select="store.selectField(field.id)"
          @remove="store.removeField(field.id)"
          @duplicate="store.duplicateField(field.id)"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<style scoped lang="less">
.design-canvas {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}
.canvas-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
}
.form-desc {
  margin-left: 12px;
  font-size: 13px;
  color: #8c8c8c;
}
.canvas-body {
  min-height: 200px;
}
.canvas-fields {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  margin: 0 -8px;
}
</style>
