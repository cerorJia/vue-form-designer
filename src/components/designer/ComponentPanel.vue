<script setup lang="ts">
import * as Icons from '@ant-design/icons-vue'
import type { FunctionalComponent } from 'vue'
import { FIELD_META, FIELD_PANEL_ORDER } from '@/constants/fieldTypes'
import { useDesignerStore } from '@/stores/designer'

const store = useDesignerStore()
const iconMap = Icons as unknown as Record<string, FunctionalComponent>
</script>

<template>
  <div class="component-panel">
    <div class="panel-title">组件库</div>
    <div class="panel-hint">点击添加到画布</div>
    <div class="field-grid">
      <button
        v-for="type in FIELD_PANEL_ORDER"
        :key="type"
        class="field-item"
        @click="store.addField(type)"
      >
        <component :is="iconMap[FIELD_META[type].icon]" class="field-icon" />
        <span>{{ FIELD_META[type].label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.component-panel {
  padding: 16px 12px;
}
.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
}
.panel-hint {
  margin: 4px 0 12px;
  font-size: 12px;
  color: #8c8c8c;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.field-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 6px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #4e5969;
  transition: all 0.15s;
}
.field-item:hover {
  color: #1677ff;
  border-color: #1677ff;
  background: #f0f7ff;
}
.field-icon {
  font-size: 18px;
}
</style>
