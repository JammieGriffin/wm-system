<script setup lang="ts">
import { SettingsOutline as setting } from "@vicons/ionicons5";
import { NewTab as plus } from "@vicons/carbon";
import {
  IWarehouseInfo,
  IRenameForm,
  INewHouseForm,
} from "../../interface/dataModel";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage, useDialog, FormInst, FormItemRule } from "naive-ui";
import { objectToString } from "@vue/shared";
import { baseAxios } from "../../const";
import { IHouseType, INewHouse } from "../../api/data";

const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const emptyStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

const warehouseInfo: Array<IWarehouseInfo> = reactive([]);
/**
 *  {
    id: "7af5831cb5",
    name: "1号仓库",
    status: {
      value: "运行中",
      label: "success",
    },
    type: "生产原料仓库",
    capacity: 20000,
  },
  {
    id: "7af5831cb5",
    name: "2号仓库",
    status: {
      value: "已停用",
      label: "default",
    },
    type: "其它物料仓库",
    capacity: 20000,
  },
  {
    id: "7af5831cb5",
    name: "3号仓库",
    status: {
      value: "已爆满",
      label: "error",
    },
    type: "成品存储仓库",
    capacity: 20000,
  },
  {
    id: "7af5831cb5",
    name: "4号仓库",
    status: {
      value: "维护中",
      label: "warning",
    },
    type: "生产原料仓库",
    capacity: 20000,
  },
 */

// 仓库快捷设置相关
const renameModal = ref<boolean>(false);
const renameFormRef = ref<FormInst | null>(null);
let houseIndex: number = -1;
const renameForm: IRenameForm = reactive({
  houseId: "",
  houseOldName: "",
  houseNewName: "",
});
const settingOptions = [
  {
    label: "修改名称",
    key: "rename",
  },
  {
    label: "切换状态",
    key: "changeStatus",
    children: [
      {
        label: "启用",
        key: "active",
      },
      {
        label: "停用",
        key: "blockup",
      },
      {
        label: "维护",
        key: "maintain",
      },
    ],
  },
  {
    label: "删除仓库",
    key: "delHouse",
  },
];

function openOptions(index: number) {
  houseIndex = index;
}
function handleSetting(key: string) {
  switch (key) {
    case "active":
      if (warehouseInfo[houseIndex].status.label === "error") {
        message.error("仓库已爆满，无法更变状态");
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: "success",
        value: "运行中",
      };
      break;
    case "blockup":
      if (warehouseInfo[houseIndex].status.label === "error") {
        message.error("仓库已爆满，无法更变状态");
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: "default",
        value: "已停用",
      };
      break;
    case "maintain":
      if (warehouseInfo[houseIndex].status.label === "error") {
        message.error("仓库已爆满，无法更变状态");
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: "warning",
        value: "维护中",
      };
      break;
    case "rename":
      renameModal.value = true;
      let { id, name } = warehouseInfo[houseIndex];
      renameForm.houseId = id;
      renameForm.houseOldName = name;
      break;
    case "delHouse":
      delHouse();
      break;
  }
}
function handleClose() {
  let key: keyof IRenameForm;
  for (key in renameForm) {
    renameForm[key] = "";
  }
}
const renameRule = {
  houseNewName: {
    required: true,
    message: "请输入新的仓库名称",
    trigger: "blur",
  },
};
function rename() {
  renameFormRef.value?.validate((err) => {
    if (!err) {
      warehouseInfo[houseIndex].name = renameForm.houseNewName;
      renameModal.value = false;
    }
  });
}
function delHouse() {
  dialog.warning({
    title: "删除仓库",
    content: "是否确认删除？此操作不可逆转",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    closable: false,
    negativeButtonProps: { type: "default" },
    onPositiveClick: () => {
      warehouseInfo.splice(houseIndex, 1);
    },
  });
}
//新建仓库相关
const newHouseModal = ref<boolean>(false);
const newHouseFormRef = ref<FormInst | null>(null);
const newHouseForm: INewHouseForm = reactive({
  houseName: "",
  houseType: null,
  houseArea: 0,
  capacity: 0,
  otherType: "",
});
const minCapacity = computed(() => {
  return Math.round(newHouseForm.houseArea * 0.3 * 50);
});
const maxCapacity = computed(() => {
  return Math.round(newHouseForm.houseArea * 0.6 * 50);
});
const houseTypeOptions: Array<IHouseType> = reactive([]);
const newHouseFormRules = {
  houseName: {
    required: true,
    message: "请输入仓库名称",
    trigger: blur,
  },
  houseType: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!newHouseForm.houseType) {
        return new Error("请选择仓库类型");
      } else {
        if (newHouseForm.houseType === -1) {
          if (!newHouseForm.otherType) {
            return new Error("请输入仓库类型名称");
          }
        }
      }
    },
    trigger: blur,
  },
  houseArea: {
    type: "number",
    required: true,
    message: "请输入仓库面积",
    trigger: blur,
  },
  capacity: [
    {
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (value === 0) {
          return new Error("请输入仓库容量");
        }
      },
      trigger: blur,
    },
    {
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (newHouseForm.houseArea === 0) {
          return new Error("请先输入仓库面积");
        }
        return true;
      },
      trigger: "input",
    },
  ],
};
function createNewHouse() {
  newHouseFormRef.value?.validate((err) => {
    if (!err) {
      const { houseName, capacity, houseArea, houseType, otherType } =
        newHouseForm;
      const newHouse: INewHouse = {
        name: houseName,
        type: houseType as number,
        area: houseArea,
        capacity: capacity,
        typeName: otherType,
      };
      baseAxios.post("/warehouse/newHouse", newHouse).then((res) => {});
      newHouseModal.value = false;
    }
  });
}
function closeNewHouseModal() {
  newHouseForm.houseType = null;
  newHouseForm.houseName = "";
  newHouseForm.houseArea = 0;
  newHouseForm.capacity = 0;
  newHouseForm.otherType = "";
}

onMounted(async () => {
  await baseAxios.get("/warehouse/queryHouseTypeList").then((res) => {
    Object.assign(houseTypeOptions, res.data.result);
    houseTypeOptions.push({
      htid: -1,
      value: "其它类型",
    });
  });
});
</script>
<template>
  <n-grid :cols="4" x-gap="20" y-gap="20">
    <n-gi v-for="(house, index) in warehouseInfo" :key="index">
      <n-card :title="house.name" embedded hoverable>
        <template #header-extra>
          <n-dropdown
            trigger="click"
            :options="settingOptions"
            @select="handleSetting"
          >
            <n-button text @click="openOptions(index)">
              <n-icon size="24" class="setting">
                <setting />
              </n-icon>
            </n-button>
          </n-dropdown>
        </template>
        <n-descriptions
          label-placement="left"
          :column="1"
          style="cursor: pointer"
          @click="
            router.push({ name: 'sapwmDetial', params: { id: house.id } })
          "
        >
          <n-descriptions-item label="仓库编号">{{
            house.id
          }}</n-descriptions-item>
          <n-descriptions-item label="仓库类型">{{
            house.type
          }}</n-descriptions-item>
          <n-descriptions-item label="仓库容量"
            >{{ house.capacity }}单位</n-descriptions-item
          >
          <n-descriptions-item label="仓库状态">
            <n-tag :bordered="false" :type="house.status.label" round>{{
              house.status.value
            }}</n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card
        embedded
        hoverable
        :content-style="emptyStyle"
        @click="newHouseModal = true"
      >
        <n-empty description="新建仓库">
          <template #icon>
            <n-icon>
              <plus />
            </n-icon>
          </template>
        </n-empty>
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal v-model:show="renameModal" @after-leave="handleClose">
    <n-card style="width: 500px; min-height: 0px" title="修改仓库名称">
      <n-form :model="renameForm" :rules="renameRule" ref="renameFormRef">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item label="仓库编号">{{
            renameForm.houseId
          }}</n-descriptions-item>
          <n-descriptions-item label="当前仓库名称">{{
            renameForm.houseOldName
          }}</n-descriptions-item>
        </n-descriptions>
        <n-form-item path="houseNewName">
          <n-input
            v-model:value="renameForm.houseNewName"
            placeholder="请输入新的仓库名称"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="rename">修改</n-button>
          <n-button @click="renameModal = false">取消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="newHouseModal" @after-leave="closeNewHouseModal">
    <n-card style="width: 30vw" title="新建仓库">
      <n-form
        :model="newHouseForm"
        :rules="newHouseFormRules"
        ref="newHouseFormRef"
      >
        <n-form-item path="houseName" label="仓库名称">
          <n-input
            v-model:value="newHouseForm.houseName"
            placeholder="请输入仓库名称"
          />
        </n-form-item>
        <n-form-item path="houseType" label="仓库类型">
          <n-select
            v-model:value="newHouseForm.houseType"
            :options="houseTypeOptions"
            placeholder="请选择仓库类型"
            label-field="value"
            value-field="htid"
            style="width: 100%"
            :class="{ otherType: newHouseForm.houseType === -1 }"
          />
          <n-input
            v-model:value="newHouseForm.otherType"
            placeholder="请输入类型名称"
            v-if="newHouseForm.houseType === -1"
          />
        </n-form-item>
        <n-form-item path="houseArea" label="仓库面积">
          <n-input-number
            v-model:value="newHouseForm.houseArea"
            placeholser="请输入仓库面积"
            min="0"
            max="1000000"
            :precision="0"
            style="width: 100%"
          >
            <template #suffix>
              <span style="color: #afb0b2">平方米</span>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item path="capacity" label="仓库容量">
          <n-input-number
            v-model:value="newHouseForm.capacity"
            placeholder="请规定仓库容量"
            :min="minCapacity"
            :max="maxCapacity"
            step="1000"
            :precision="0"
            style="width: 100%"
          >
            <template #suffix>
              <span style="color: #afb0b2">单位</span>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item>
          <n-space justify="end" style="width: 100%">
            <n-button type="primary" @click="createNewHouse">创建</n-button>
            <n-button @click="newHouseModal = false">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>
<style lang="scss" scoped>
.n-card {
  border-radius: 15px;
  min-height: 221px;
}

.setting {
  cursor: pointer;
}

.otherType {
  margin-right: 12px;
}
</style>
