import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Login = () => import('../views/sys/Login.vue');


const routes: Array<RouteRecordRaw> = [
    {
        path:'/login',
        name:'login',
        component:Login,
        meta:{
            title:'用户登录',
            url:'/login'
        }
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router