<script setup lang="ts">
import * as Icons from '@ant-design/icons-vue'
import type { FunctionalComponent } from 'vue'
import { COLUMN_PANEL_ORDER, COLUMN_TYPE_META } from '@/constants/columnTypes'
import { useTableDesignerStore } from '@/stores/tableDesigner'

const store = useTableDesignerStore()
const iconMap = Icons as unknown as Record<string, FunctionalComponent>
</script>

<template>
  <div class="column-panel">
    <div class="panel-title">列类型</div>
    <div class="panel-hint">点击添加列到表格</div>
    <div class="col-grid">
      <button
        v-for="type in COLUMN_PANEL_ORDER"
        :key="type"
        class="col-item"
        @click="store.addColumn(type)"
      >
        <component :is="iconMap[COLUMN_TYPE_META[type].icon]" class="col-icon" />
        <span>{{ COLUMN_TYPE_META[type].label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.column-panel {
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
.col-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.col-item {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.col-item:hover {
  color: #1677ff;
  border-color: #1677ff;
  background: #f0f7ff;
}
.col-icon {
  font-size: 18px;
}
</style>
