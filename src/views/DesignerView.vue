<script setup lang="ts">
import { useDesignerStore } from '@/stores/designer'
import Toolbar from '@/components/designer/Toolbar.vue'
import ComponentPanel from '@/components/designer/ComponentPanel.vue'
import DesignCanvas from '@/components/designer/DesignCanvas.vue'
import PropertyPanel from '@/components/designer/PropertyPanel.vue'
import PreviewPane from './PreviewPane.vue'

const store = useDesignerStore()
</script>

<template>
  <div class="designer-view">
    <Toolbar />

    <div class="designer-body">
      <PreviewPane v-if="store.mode === 'preview'" class="preview-fill" />

      <template v-else>
        <aside class="panel-left">
          <ComponentPanel />
        </aside>
        <main class="panel-center">
          <DesignCanvas />
        </main>
        <aside class="panel-right">
          <PropertyPanel />
        </aside>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.designer-view {
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
  width: 320px;
  background: #fff;
  border-left: 1px solid #e5e6eb;
}
.preview-fill {
  flex: 1;
  overflow-y: auto;
}
</style>
