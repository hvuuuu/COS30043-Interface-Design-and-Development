import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/units',
    name: 'units',
    component: () => import('../views/UnitsPage.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/TasksPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
