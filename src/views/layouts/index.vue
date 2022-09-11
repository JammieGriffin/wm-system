<script setup lang="ts">
import Header from "./Header.vue";
import Content from "./Content.vue";
import Siderbar from "./Siderbar.vue";
</script>
<template>
    <n-layout has-sider position="absolute">
        <Siderbar />
        <n-dialog-provider>
            <n-layout>
                <Header />
                <Content />
            </n-layout>
        </n-dialog-provider>

    </n-layout>
</template>
<style lang="scss" scoped>
.container {
    overflow: hidden;
}
</style>