<script lang="ts" setup>
import { Component, h, reactive, ref } from "vue";
import {
  StatsChartOutline as ICconsole,
  PowerOutline as IClogout,
} from "@vicons/ionicons5";
import {
  WarehouseOutlined as ICwarehouse,
  ManageAccountsOutlined as ICstaff,
  FactCheckOutlined as ICcheck,
} from "@vicons/material";
import { CalendarSettings16Regular as ICmaterial } from "@vicons/fluent";
import { MenuOption, NIcon } from "naive-ui";
import { RouterLink } from "vue-router";
import { useUsrstore } from "../../store";
import { IUsr } from "../../api/data";

const collapsed = ref(true);
const store = useUsrstore();
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/console",
          },
        },
        { default: () => "控制台" }
      ),
    key: "console",
    icon: renderIcon(ICconsole),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/sapwm",
          },
        },
        { default: () => "仓库管理" }
      ),
    key: "sapwm",
    icon: renderIcon(ICwarehouse),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/pmc",
          },
        },
        { default: () => "物料管理" }
      ),
    key: "pmc",
    icon: renderIcon(ICmaterial),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/staff",
          },
        },
        { default: () => "仓库员工管理" }
      ),
    key: "staff",
    icon: renderIcon(ICstaff),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: { path: "/login" },
        },
        { default: () => "退出登录" }
      ),
    key: "logout",
    icon: renderIcon(IClogout),
  },
];
function handleUpdate(key: string) {
  if(key === "logout"){
    store.$state.token = "";
    store.$state.usr = {} as IUsr;
  }
}
</script>
<template>
  <n-layout-sider
    bordered
    show-trigger="bar"
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      @update:value="handleUpdate"
    ></n-menu>
  </n-layout-sider>
</template>
<style lang="scss" scoped>
.container {
  width: 12vw;
  height: 100vh;
  padding: 20px;
  border-right: 2px solid #efeff5;
  overflow: hidden;
  .avatar {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    gap: 8px;
    img {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
