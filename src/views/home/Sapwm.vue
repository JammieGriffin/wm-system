<script setup lang="ts">
import { SettingsOutline as setting } from "@vicons/ionicons5";
import { NewTab as plus } from "@vicons/carbon";
import {
  IWarehouseInfo,
  IRenameForm,
  INewHouseForm,
} from "../../interface/dataModel";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useMessage, useDialog, FormInst, FormItemRule } from "naive-ui";
import { baseAxios } from "../../const";
import { IHouse, IHouseType, INewHouse } from "../../api/data";
import router from "../../router";
const message = useMessage();
const dialog = useDialog();

const emptyStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  height: "100%",
};

const warehouseInfo = ref<Array<IWarehouseInfo>>([]);

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
function changeHouseStatus(key: string) {
  const { status, id } = warehouseInfo.value[houseIndex];
  if (status.label === "error") {
    return message.error("仓库已爆满，无法更变状态");
  } else {
    let state = {
      label: "",
      value: "",
    };
    let hsid: number = -1;
    switch (key) {
      case "active":
        if (status.label === "success") return;
        state = {
          label: "success",
          value: "运行中",
        };
        hsid = 3;
        break;
      case "blockup":
        if (status.label === "default") return;
        state = {
          label: "def",
          value: "未运行",
        };
        hsid = 1;
        break;
      case "maintain":
        if (status.label === "warning") return;
        state = {
          label: "warning",
          value: "维护中",
        };
        hsid = 2;
        break;
    }
    baseAxios
      .post("/warehouse/changeHouseType", {
        id,
        hsid,
      })
      .then((res) => {
        if (res.data.success) {
          warehouseInfo.value[houseIndex].status = {
            label: state.label === "def" ? "default" : state.label,
            value: state.value,
          };
          message.success("修改仓库状态成功");
        } else {
          message.error(res.data.message);
        }
      });
  }
}
function handleSetting(key: string) {
  switch (key) {
    case "rename":
      renameModal.value = true;
      let { id, name } = warehouseInfo.value[houseIndex];
      renameForm.houseId = id;
      renameForm.houseOldName = name;
      break;
    case "delHouse":
      delHouse();
      break;
    default:
      changeHouseStatus(key);
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
      baseAxios
        .post("/warehouse/rename", {
          hid: renameForm.houseId,
          newName: renameForm.houseNewName,
        })
        .then((res) => {
          if (res.data.success) {
            message.success(res.data.message);
            warehouseInfo.value[houseIndex].name = renameForm.houseNewName;
          } else {
            message.error(res.data.message);
          }
        })
        .finally(() => {
          renameModal.value = false;
        });
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
      baseAxios
        .delete(`/warehouse/delHouse?id=${warehouseInfo!.value[houseIndex].id}`)
        .then((res) => {
          if (res.data.success) {
            message.success(res.data.message);
            warehouseInfo.value.splice(houseIndex, 1);
          } else {
            message.error(res.data.result);
          }
        });
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
  otherType: null,
});
const minCapacity = computed(() => {
  return Math.round(newHouseForm.houseArea * 0.3 * 50);
});
const maxCapacity = computed(() => {
  return Math.round(newHouseForm.houseArea * 0.6 * 50);
});
const houseTypeOptions = ref<Array<IHouseType>>([]);
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
      baseAxios
        .post("/warehouse/newHouse", newHouse)
        .then((res) => {
          message.success(res.data.message);
        })
        .catch((err) => {
          message.error(err);
        })
        .finally(() => {
          loadHouseTypeList();
          loadWreahouse();
          newHouseModal.value = false;
        });
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
function loadHouseTypeList() {
  baseAxios.get("/warehouse/getHouseTypeList").then((res) => {
    houseTypeOptions.value = res.data.result
    houseTypeOptions.value.push({
      htid: -1,
      typeName: "其它类型",
    });
  });
}
function loadWreahouse() {
  baseAxios
    .get("/warehouse/getWarehouseList")
    .then((res) => {
      const list:IWarehouseInfo[] = [];
      res.data.result.forEach((house: IHouse) => {
        list.push({
          id: house.hid,
          name: house.houseName,
          hsid: house.hsid,
          status: {
            value: house.value,
            label: house.style === "def" ? "default" : house.style,
          },
          type: house.typeName,
          houseArea: house.houseArea,
          capacity: house.capacity,
        });
      });
      warehouseInfo.value = list;
    })
    .catch((err) => {
      message.error(err);
    });
}
onMounted(async () => {
  loadWreahouse();
  loadHouseTypeList();
});
</script>
<template>
  <n-grid :cols="4" x-gap="20" y-gap="20">
    <!-- 仓库列表 -->
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
          <n-descriptions-item label="仓库面积">{{
            house.houseArea
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
    <!-- 新建仓库 -->
    <n-gi>
      <n-card
        embedded
        hoverable
        :content-style="emptyStyle"
        style="height: 100%"
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
  <!-- 修改仓库名称弹窗 -->
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
  <!-- 新建仓库弹窗 -->
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
            label-field="typeName"
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
