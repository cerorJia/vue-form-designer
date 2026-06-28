<script setup lang="ts">
import { Card } from 'ant-design-vue'
import { useTableDesignerStore } from '@/stores/tableDesigner'
import TableToolbar from '@/components/designer/table/TableToolbar.vue'
import TableColumnPanel from '@/components/designer/table/TableColumnPanel.vue'
import TableCanvas from '@/components/designer/table/TableCanvas.vue'
import TablePropertyPanel from '@/components/designer/table/TablePropertyPanel.vue'
import TableRenderer from '@/components/renderer/TableRenderer.vue'

const store = useTableDesignerStore()
</script>

<template>
  <div class="table-designer">
    <TableToolbar />

    <div class="designer-body">
      <div v-if="store.mode === 'preview'" class="preview-fill">
        <Card :title="store.schema.title" class="preview-card">
          <TableRenderer :schema="store.schema" />
        </Card>
      </div>

      <template v-else>
        <aside class="panel-left">
          <TableColumnPanel />
        </aside>
        <main class="panel-center">
          <TableCanvas />
        </main>
        <aside class="panel-right">
          <TablePropertyPanel />
        </aside>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.table-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f6f8;
}
.designer-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.panel-left {
  width: 240px;
  background: #fafbfc;
  border-right: 1px solid #e5e6eb;
  overflow-y: auto;
}
.panel-center {
  flex: 1;
  overflow: hidden;
}
.panel-right {
  width: 340px;
  background: #fff;
  border-left: 1px solid #e5e6eb;
}
.preview-fill {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
.preview-card {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
