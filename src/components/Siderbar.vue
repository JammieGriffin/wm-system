<script lang="ts" setup>
import { ref } from "vue";
import router from "../router";
const AnchorRef = ref();

const AnchorList = [
    {
        name: "登录",
        path: "/login",
    },
    {
        name: "注册",
        path: "/register"
    },
];
let currentItemIndex: number = -1;
function onItemSelect(item:any,index: number) {
    const items = AnchorRef.value.children;
    if (currentItemIndex != -1) {
        items[currentItemIndex].classList.remove("link-active");
    } else {
        currentItemIndex = index;
        items[currentItemIndex].classList.add("link-active");
    }
    currentItemIndex = index;
    items[currentItemIndex].classList.add("link-active");
    router.push({path:item.path})
}
</script>
<template>
    <div class="container">
        <div class="avatar">
            <n-avatar round size="large"></n-avatar>
            <span>JammieGriffin</span>
        </div>
        <n-divider />
        <div class="anchor" ref="AnchorRef">
            <div class="anchor-item" v-for="(item,index) in AnchorList" :key="index">
                <div class="link" @click="onItemSelect(item,index)">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.container {
    width: 16vw;
    height: 100vh;
    padding: 20px;
    border-right: 2px solid #efeff5;
    overflow: hidden;
    .avatar {
        display: flex;
        align-items: center;
        padding: 15px 0 0 10px;
        gap: 8px;
    }
    .anchor {
        display: flex;
        flex-direction: column;
        .link {
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
            height: 40px;
            display: flex;
            align-items: center;
            padding: 0 15px;
        }
        .link:hover {
            background-color: #e9f7ed;
            color: #68c190;
        }
        .link-active,
        .link-active:hover {
            background-color: #0f9e47;
            color: #fff;
            border-radius: 5px;
        }
    }
}
</style>