import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Login = () => import("../views/sys/Login.vue");
const Register = () => import("../views/sys/Register.vue");
const Layout = () => import("../views/layouts/index.vue");
const Console = () => import("../views/home/Console.vue");
const Sapwm = () => import("../views/home/Sapwm.vue");
const Sapwm_detial = () => import ("../views/children/SapwmDetial.vue");
const Pmc = () => import("../views/home/Pmc.vue");
const Staff = () => import("../views/home/Staff.vue");
const Checkin = () => import("../views/home/Staff.vue");

const MainRoutes: Array<RouteRecordRaw> = [
  {
    path:"/console",
    name:"console",
    component: Console,
    meta:{
      title:"控制台"
    }
  },
  {
    path:"/sapwm",
    name:"sapwm",
    component: Sapwm,
    meta:{
      title:"仓库管理"
    }
  },
  {
    path:'/sapwm/detial/:id',
    name:'sapwmDetial',
    component: Sapwm_detial,
    meta:{
      title:'仓库详情'
    }
  },
  {
    path:"/pmc",
    name:"pmc",
    component:Pmc,
    meta:{
      title:"物料管理"
    }
  },
  {
    path:"/staff",
    name:"staff",
    component:Staff,
    meta:{
      title:"仓库员工管理"
    }
  },
  {
    path:"/checkin",
    name:"checkin",
    component:Checkin,
    meta:{
      title:"进出库登记"
    }
  }
];

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
    path: "/",
    name: "layout",
    component: Layout,
    meta:{
      url:'/'
    },
    children:[...MainRoutes]
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
