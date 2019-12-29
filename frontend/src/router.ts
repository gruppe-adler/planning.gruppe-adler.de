import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
        path: '/join/:id',
        props: true,
        component: () => import(/* webpackChunkName: "session" */ './views/Join.vue')
    },
    {
        path: '/create',
        component: () => import(/* webpackChunkName: "create" */ './views/Create.vue')
    },
    {
        path: '/session/:id',
        props: true,
        component: () => import(/* webpackChunkName: "session" */ './views/Session.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
