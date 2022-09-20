<script lang="ts" setup>
import { ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { Person, LockClosed } from "@vicons/ionicons5";
import { ILoginModel } from "../../interface/sysModel";
import { baseAxios } from "../../const";
import "../../scss/sys.scss";

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
function onLogin(evt: MouseEvent) {
  loginForm.value?.validate((errors) => {
    if (!errors) {
      if (loginModel.value.checkDeal) {
        baseAxios
          .post("/sys/login", {
            account: loginModel.value.account,
            pwd: loginModel.value.pwd,
          })
          .then((res) => {
            console.log(res)
          });
      }
    } else {
      message.error("error");
    }
  });
}
</script>
<template>
  <div class="sys-layout">
    <div class="sys-card">
      <div class="sys-form">
        <n-h2>用户登录</n-h2>
        <n-form ref="loginForm" :model="loginModel" :rules="loginRules">
          <n-form-item path="account" label="账号" :show-require-mark="false">
            <n-input
              v-model:value="loginModel.account"
              @keydown.enter.prevent
              round
              size="large"
              placeholder="请输入账号"
            >
              <template #prefix>
                <n-icon style="margin-right: 10px">
                  <Person />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="pwd" label="密码" :show-require-mark="false">
            <n-input
              v-model:value="loginModel.pwd"
              type="password"
              round
              size="large"
              show-password-on="click"
              placeholder="请输入密码"
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
            <n-button
              text
              type="info"
              @click="$router.push({ path: '/register' })"
              >用户注册</n-button
            >
            <n-button text type="info">忘记密码</n-button>
          </n-space>
        </n-form>
      </div>
      <n-divider vertical style="height: 100%; color: #f2f4f7"></n-divider>
      <div class="sys-ikon">
        <img src="../../assets/svg/i-warehouse.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
