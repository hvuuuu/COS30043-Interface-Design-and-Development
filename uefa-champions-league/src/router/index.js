import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/matches',
                    name: 'matches',
                    component: () => import('@/views/pages/Matches.vue')
                },
                {
                    path: '/pages/search',
                    name: 'search',
                    component: () => import('@/views/pages/Search.vue')
                },
                {
                    path: '/pages/standings',
                    name: 'standings',
                    component: () => import('@/views/pages/Standings.vue')
                },
                {
                    path: '/pages/match-details-:id',
                    name: 'match-details',
                    component: () => import('@/views/pages/MatchDetails.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
