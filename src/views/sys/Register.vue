<script lang="ts" setup>
import "../../scss/sys.scss";
import { IRegisterModel } from "../../interface/sysModel";
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { baseAxios } from "../../const";
import { useUsrstore } from "../../store";

const message = useMessage();
const store = useUsrstore();
const router = useRouter();
const registerForm = ref<FormInst | null>(null);
const repwdRef = ref<FormItemInst | null>(null);
const registerModel = ref<IRegisterModel>({
  account: null,
  pwd: null,
  repwd: null,
  phone: null,
  sex: null,
  usrName: null,
});
const checkDeal = ref<boolean>(false);
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
  usrName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: ["blur"],
    }
  ],
  account: [
    {
      required: true,
      validator:(rule:FormItemRule,value:string) => {
        if(!value){
          return new Error("请输入账号");
        } else if(value.length !== 12){
          return new Error("账号长度应为12");
        }
        return true;
      },
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
      validator: (rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error("请再次输入密码");
        } else if (value !== registerModel.value.pwd) {
          return new Error("两次输入的密码不一致");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  sex: [
    {
      required: true,
      message: "请选择性别",
      trigger: ["blur","change"],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error("请输入手机号码");
        } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
          return new Error("输入的手机号不合法")
        }
        return true;
      }
    }
  ]
};
function onRegister(): void {
  registerForm.value?.validate((err) => {
    if(!err){
      if(!checkDeal.value){
        message.error("请勾选《用户服务协议》");
      } else{
        baseAxios.post("/sys/register",registerModel.value).then((res:any) => {
          if(res.data.success){
            store.$state.token = res.data.token;
            store.$state.usr = res.data.result;
            router.push({path:"/console"});
          }else{
            message.error(res.data.message);
          }
        });
      }
    }else{
      message.error("请将信息填写完整");
    }
  });
}
</script>
<template>
  <div class="sys-layout">
    <div class="sys-card">
      <div class="sys-form scroll">
        <n-h2>用户注册</n-h2>
        <n-form ref="registerForm" :model="registerModel" :rules="registerRules">
          <n-form-item path="usrName" label="姓名" :show-require-mark="false">
            <n-input v-model:value="registerModel.usrName" round size="large" placeholder="请输入姓名" />
          </n-form-item>
          <n-form-item path="sex" label="性别" label-placement="left" :show-require-mark="false">
            <n-radio-group v-model:value="registerModel.sex">
              <n-space>
                <n-radio value="男">男</n-radio>
                <n-radio value="女">女</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item path="account" label="账号" :show-require-mark="false">
            <n-input v-model:value="registerModel.account" @keydown.enter.prevent round size="large"
              placeholder="请输入账号"></n-input>
          </n-form-item>
          <n-form-item path="pwd" label="密码" :show-require-mark="false">
            <n-input v-model:value="registerModel.pwd" @keydown.enter.prevent round size="large" placeholder="请输入密码"
              type="password" show-password-on="click"></n-input>
          </n-form-item>
          <n-form-item path="repwd" label="重复密码" :show-require-mark="false" ref="repwdRef">
            <n-input v-model:value="registerModel.repwd" @keydown.enter.prevent round size="large" placeholder="请再次输入密码"
              @input="checkRePwdInput" type="password" show-password-on="click">
            </n-input>
          </n-form-item>
          <n-form-item path="phone" label="手机号" :show-require-mark="false">
            <n-input v-model:value="registerModel.phone" @keydown.enter.prevent round size="large" placeholder="请输入手机号">
            </n-input>
          </n-form-item>
          <div>
            <n-checkbox v-model:checked="checkDeal">
              我已阅读并同意
            </n-checkbox>
            <n-button text type="info">《用户服务协议》</n-button>
          </div>
          <n-form-item>
            <n-button round size="large" type="info" text-color="#FFF" style="width: 100%" @click="onRegister">注册
            </n-button>
          </n-form-item>
          <n-space justify="space-between">
            <n-button text type="info" @click="$router.push({ path: '/login' })">返回登录</n-button>
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
