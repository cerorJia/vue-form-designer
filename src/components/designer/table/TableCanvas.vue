<script setup lang="ts">
import { computed } from 'vue'
import { Empty, Tag } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import {
  CopyOutlined,
  DeleteOutlined,
  HolderOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons-vue'
import type { TableColumnSchema } from '@/types/table'
import { COLUMN_TYPE_META } from '@/constants/columnTypes'
import { useTableDesignerStore } from '@/stores/tableDesigner'

const store = useTableDesignerStore()

const columns = computed<TableColumnSchema[]>({
  get: () => store.schema.columns,
  set: (val) => store.setColumns(val),
})
</script>

<template>
  <div class="table-canvas" @click="store.selectColumn(null)">
    <div class="canvas-header">
      <span class="table-title">{{ store.schema.title }}</span>
      <span v-if="store.schema.description" class="table-desc">{{ store.schema.description }}</span>
    </div>

    <Empty
      v-if="!columns.length"
      description="点击左侧列类型添加表格列，拖动手柄可调整顺序"
      style="margin-top: 80px"
    />

    <VueDraggable
      v-else
      v-model="columns"
      :animation="150"
      handle=".col-drag"
      class="col-list"
    >
      <div
        v-for="col in columns"
        :key="col.id"
        class="col-card"
        :class="{ active: store.activeColumnId === col.id }"
        @click.stop="store.selectColumn(col.id)"
      >
        <span class="col-drag"><HolderOutlined /></span>

        <div class="col-main">
          <div class="col-line">
            <span class="col-title">{{ col.title }}</span>
            <Tag color="default">{{ COLUMN_TYPE_META[col.type].label }}</Tag>
            <Tag v-if="col.searchable" color="blue">
              <SearchOutlined /> 可搜索
            </Tag>
            <Tag v-if="col.type === 'subtable'" color="purple">
              <TableOutlined /> 嵌套
            </Tag>
          </div>
          <div class="col-sub">参数：{{ col.field }}</div>
        </div>

        <div class="col-actions" @click.stop>
          <CopyOutlined class="act" title="复制" @click="store.duplicateColumn(col.id)" />
          <DeleteOutlined class="act danger" title="删除" @click="store.removeColumn(col.id)" />
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped lang="less">
.table-canvas {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}
.canvas-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.table-title {
  font-size: 18px;
  font-weight: 600;
}
.table-desc {
  margin-left: 12px;
  font-size: 13px;
  color: #8c8c8c;
}
.col-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.col-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px 12px 28px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.col-card:hover {
  border-color: #91caff;
}
.col-card.active {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.12);
}
.col-drag {
  position: absolute;
  left: 8px;
  color: #bfbfbf;
  cursor: move;
  font-size: 16px;
}
.col-main {
  flex: 1;
}
.col-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
.col-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
}
.col-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}
.col-actions {
  display: flex;
  gap: 10px;
}
.act {
  font-size: 15px;
  color: #8c8c8c;
}
.act:hover {
  color: #1677ff;
}
.act.danger:hover {
  color: #ff4d4f;
}
</style>
