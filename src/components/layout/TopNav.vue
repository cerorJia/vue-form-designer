<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Segmented } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()

const current = computed(() => (route.name === 'table' ? 'table' : 'form'))

const segOptions = [
  { label: '📝 表单设计器', value: 'form' },
  { label: '📊 表格设计器', value: 'table' },
]

function onChange(val: string | number): void {
  router.push(val === 'table' ? '/table' : '/form')
}
</script>

<template>
  <div class="top-nav">
    <div class="brand">
      <span class="brand-dot"></span>
      低代码设计平台
    </div>

    <Segmented :value="current" :options="segOptions" @change="onChange" />

    <div class="nav-right"></div>
  </div>
</template>

<style scoped lang="less">
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 20px;
  background: #001529;
  color: #fff;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  width: 200px;
}
.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1677ff;
}
.nav-right {
  width: 200px;
}
.seg-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
