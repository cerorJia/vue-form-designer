import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/form' },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/DesignerView.vue'),
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('@/views/TableDesignerView.vue'),
    },
  ],
})

export default router
