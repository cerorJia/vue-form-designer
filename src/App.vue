<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/layout/TopNav.vue'
</script>

<template>
  <div class="app-shell">
    <TopNav />
    <div class="app-body">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-body {
  flex: 1;
  min-height: 0;
}
</style>
