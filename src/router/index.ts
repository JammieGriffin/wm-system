import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Login = () => import("../views/sys/Login.vue");
const Register = () => import("../views/sys/Register.vue");
const Home = () => import("../views/home/Home.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "用户登录",
      url: "/login",
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      title: "用户注册",
      url: "/register",
    },
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta:{
      title:'主页',
      url:'/home'
    }
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
