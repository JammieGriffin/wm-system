<script lang="ts" setup>
import { ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { Person, LockClosed } from "@vicons/ionicons5";
import {ILoginModel} from "../../interface/sysModel"

const message = useMessage();
const loginForm = ref<FormInst | null>(null);
const loginModel = ref<ILoginModel>({
    account: null,
    pwd: null,
    checkDeal: false,
});
const loginRules = {
    account: {
        required: true,
        message: "请输入账号",
        trigger: blur,
    },
    pwd: {
        required: true,
        message: "请输入密码",
        trigger: blur,
    },
};
function onLogin(evt: MouseEvent){
    loginForm.value?.validate((errors)=>{
        if (!errors) {
            if(loginModel.value.checkDeal){
                message.success('login');
            }
        }else{
            message.error('error');
        }
    })
}
</script>
<template>
    <div class="layout">
        <div class="login-card">
            <div class="login-form">
                <n-h2>用户登录</n-h2>
                <n-form ref="loginForm" :model="loginModel" :rules="loginRules">
                    <n-form-item
                        path="account"
                        label="账号"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="loginModel.account"
                            @keydown.enter.prevent
                            round
                            size="large"
                            placeholder="请输入账号"
                            class="login-form-input"
                        >
                            <template #prefix>
                                <n-icon style="margin-right: 10px">
                                    <Person />
                                </n-icon>
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item
                        path="pwd"
                        label="密码"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="loginModel.pwd"
                            type="password"
                            round
                            size="large"
                            show-password-on="click"
                            placeholder="请输入密码"
                            class="login-form-input"
                        >
                            <template #prefix>
                                <n-icon style="margin-right: 10px">
                                    <LockClosed />
                                </n-icon>
                            </template>
                        </n-input>
                    </n-form-item>
                    <div>
                        <n-checkbox v-model:checked="loginModel.checkDeal">
                            我已阅读并同意
                        </n-checkbox>
                        <n-button text type="info">《用户服务协议》</n-button>
                    </div>
                    <n-form-item>
                        <n-button
                            round
                            size="large"
                            type="info"
                            text-color="#FFF"
                            style="width: 100%"
                            @click="onLogin"
                            >登录</n-button
                        >
                    </n-form-item>
                    <n-space justify="space-between">
                        <n-button text type="info">用户注册</n-button>
                        <n-button text type="info">忘记密码</n-button>
                    </n-space>
                </n-form>
            </div>
            <n-divider
                vertical
                style="height: 100%; color: #f2f4f7"
            ></n-divider>
            <div class="login-ikon">
                <img src="../../assets/svg/login-ikon.svg" alt="" />
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.layout {
    width: 100vw;
    height: 100vh;
    background-color: #f2f4f7;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-card {
        width: 61.8%;
        height: 70%;
        border-radius: 20px;
        background-color: #fff;
        padding: 25px;
        display: flex;
        .login-form {
            width: 66.6%;
            padding: 40px 85px;
            
        }
        .login-ikon {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
