<script setup lang="ts">
import { SettingsOutline as setting } from "@vicons/ionicons5";
import { NewTab as plus } from "@vicons/carbon";
import { IWarehouseInfo } from "../../interface/dataModel";
import { reactive } from "vue";
import { useMessage } from "naive-ui";
const message = useMessage();
const emptyStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};
const warehouseInfo: Array<IWarehouseInfo> = reactive([
  {
    id: '7af5831cb5',
    name: '1号仓库',
    status: {
      value: '运行中',
      label: 'success',
    },
    type: '生产原料仓库',
    capacity: 20000
  },
  {
    id: '7af5831cb5',
    name: '2号仓库',
    status: {
      value: '已停用',
      label: 'default',
    },
    type: '其它物料仓库',
    capacity: 20000
  },
  {
    id: '7af5831cb5',
    name: '3号仓库',
    status: {
      value: '已爆满',
      label: 'error',
    },
    type: '成品存储仓库',
    capacity: 20000
  },
  {
    id: '7af5831cb5',
    name: '4号仓库',
    status: {
      value: '维护中',
      label: 'warning',
    },
    type: '生产原料仓库',
    capacity: 20000
  },
])
const settingOptions = [
  {
    label: '修改名称',
    key: 'rename'
  },
  {
    label: '切换状态',
    key: 'changeStatus',
    children: [
      {
        label: '启用',
        key: 'active',
      },
      {
        label: '停用',
        key: 'blockup'
      },
      {
        label: '维护',
        key: 'maintain'
      },
    ]
  },
  {
    label: '删除仓库',
    key: 'delHouse'
  }
]
let houseIndex: number = -1;
function openOptions(index: number) {
  houseIndex = index;
}
function handleSetting(key: string) {
  switch (key) {
    case 'active':
      if (warehouseInfo[houseIndex].status.label === 'error') {
        message.error('仓库已爆满，无法更变状态');
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: 'success',
        value: '运行中'
      };
      break;
    case 'blockup':
      if (warehouseInfo[houseIndex].status.label === 'error') {
        message.error('仓库已爆满，无法更变状态');
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: 'default',
        value: '已停用'
      };
      break;
    case 'maintain':
      if (warehouseInfo[houseIndex].status.label === 'error') {
        message.error('仓库已爆满，无法更变状态');
        return;
      }
      warehouseInfo[houseIndex].status = {
        label: 'warning',
        value: '维护中'
      };
      break;
  }
}
</script>
<template>
  <n-grid :cols="4" x-gap="20" y-gap="20">
    <n-gi v-for="(house,index) in warehouseInfo" :key="index">
      <n-card :title="house.name" embedded hoverable>
        <template #header-extra>
          <n-dropdown trigger="click" :options="settingOptions" @select="handleSetting">
            <n-button text @click="openOptions(index)">
              <n-icon size="24" class="setting">
                <setting />
              </n-icon>
            </n-button>
          </n-dropdown>
        </template>
        <n-descriptions label-placement="left" :column="1" style="cursor: pointer">
          <n-descriptions-item label="仓库编号">{{house.id}}</n-descriptions-item>
          <n-descriptions-item label="仓库类型">{{house.type}}</n-descriptions-item>
          <n-descriptions-item label="仓库容量">{{house.capacity}}单位</n-descriptions-item>
          <n-descriptions-item label="仓库状态">
            <n-tag :bordered="false" :type="house.status.label" round>{{house.status.value}}</n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card embedded hoverable :content-style="emptyStyle">
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
</template>
<style lang="scss" scoped>
.n-card {
  border-radius: 15px;
  min-height: 221px;
}

.setting {
  cursor: pointer;
}
</style>
