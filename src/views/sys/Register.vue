<script lang="ts" setup>
import "../../scss/sys.scss";
import { IRegisterModel, IRegisterPageCtrl } from "../../interface/sysModel";
import {
    FormInst,
    FormItemInst,
    FormItemRule,
    FormRules,
    useMessage,
} from "naive-ui";
import { reactive, ref, watch } from "vue";
import { relative } from "path";

const message = useMessage();
const resgiterForm = ref<FormInst | null>(null);
const repwdRef = ref<FormItemInst | null>(null);
const registerModel = ref<IRegisterModel>({
    account: null,
    pwd: null,
    repwd: null,
    email: null,
    captcha: null,
    checkDeal: false,
});

function checkRePwd(rule: FormItemRule, value: string): boolean {
    return (
        !!registerModel.value.pwd &&
        registerModel.value.pwd.startsWith(value) &&
        registerModel.value.pwd.length >= value.length &&
        registerModel.value.pwd === value
    );
}
function checkRePwdInput() {
    if (registerModel.value.repwd) {
        repwdRef.value?.validate({ trigger: "repwd-input" });
    }
}
const registerRules: FormRules = {
    account: [
        {
            required: true,
            message: "请输入账号",
            trigger: ["blur"],
        },
    ],
    pwd: [
        {
            required: true,
            message: "请输入密码",
            trigger: ["blur"],
        },
    ],
    repwd: [
        {
            required: true,
            message: "请再次输入密码",
            trigger: ["blur"],
        },
        {
            validator: checkRePwd,
            message: "两次密码输入不一致",
            trigger: ["input"],
        },
    ],
};
const pageCtrl: IRegisterPageCtrl = reactive({
    sendCode: false,
});
const timeout = reactive({ value: 0 });
function onRegister(): void {}
watch(
    () => pageCtrl.sendCode,
    (state) => {
        if (state) {
            timeout.value = 60;
            setInterval(() => {
                if (timeout.value > 0) {
                    timeout.value--;
                } else {
                    pageCtrl.sendCode = false;
                }
            }, 1000);
        }
    }
);

function sendCaptcha() {
    pageCtrl.sendCode = true;
}
</script>
<template>
    <div class="sys-layout">
        <div class="sys-card">
            <div class="sys-form scroll">
                <n-h2>用户注册</n-h2>
                <n-form
                    ref="resgiterForm"
                    :model="registerModel"
                    :rules="registerRules"
                >
                    <n-form-item
                        path="account"
                        label="账号"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="registerModel.account"
                            @keydown.enter.prevent
                            round
                            size="large"
                            placeholder="请输入账号"
                        ></n-input>
                    </n-form-item>
                    <n-form-item
                        path="pwd"
                        label="密码"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="registerModel.pwd"
                            @keydown.enter.prevent
                            round
                            size="large"
                            placeholder="请输入密码"
                            type="password"
                            show-password-on="click"
                        ></n-input>
                    </n-form-item>
                    <n-form-item
                        path="repwd"
                        label="重复密码"
                        :show-require-mark="false"
                        ref="repwdRef"
                    >
                        <n-input
                            v-model:value="registerModel.repwd"
                            @keydown.enter.prevent
                            round
                            size="large"
                            placeholder="请再次输入密码"
                            @input="checkRePwdInput"
                            type="password"
                            show-password-on="click"
                        >
                        </n-input>
                    </n-form-item>
                    <n-form-item
                        path="email"
                        label="邮箱地址"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="registerModel.email"
                            @keydown.enter.prevent
                            round
                            size="large"
                            placeholder="请输入邮箱地址"
                        >
                        </n-input>
                    </n-form-item>
                    <n-form-item
                        path="captcha"
                        label="验证码"
                        :show-require-mark="false"
                    >
                        <n-input
                            v-model:value="registerModel.captcha"
                            round
                            size="large"
                            placeholder="请输入邮箱验证码"
                        >
                            <template #suffix>
                                <n-divider
                                    vertical
                                    style="background-color: #2080f0"
                                ></n-divider>
                                <n-button
                                    text
                                    type="info"
                                    @click="sendCaptcha"
                                    v-if="!pageCtrl.sendCode"
                                    >发送验证码
                                </n-button>
                                <span v-else style="color: #2080f0"
                                    >{{ timeout.value }}s</span
                                >
                            </template>
                        </n-input>
                    </n-form-item>
                    <div>
                        <n-checkbox v-model:checked="registerModel.checkDeal">
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
                            @click="onRegister"
                            >注册</n-button
                        >
                    </n-form-item>
                    <n-space justify="space-between">
                        <n-button
                            text
                            type="info"
                            @click="$router.push({ path: '/login' })"
                            >返回登录</n-button
                        >
                    </n-space>
                </n-form>
            </div>

            <n-divider
                vertical
                style="height: 100%; color: #f2f4f7"
            ></n-divider>
            <div class="sys-ikon">
                <img src="../../assets/svg/i-warehouse.svg" alt="" />
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.scroll {
    max-height: 375px;
    overflow-y: scroll;
    scrollbar-width: none;
}
.scroll::-webkit-scrollbar {
    display: none;
}
</style>
