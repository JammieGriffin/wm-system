<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from "vue";
import {
  IBaseChartData,
  IHouseDetialInfo,
  IODetialData,
  IQuery,
} from "../../interface/dataModel";
import { drawCapacityUsage } from "../../tools/drawCanvas";
import { EditSettings24Regular as edit } from "@vicons/fluent";
import {
  InputOutlined as ICInput,
  OutputOutlined as ICOutput,
} from "@vicons/material";
import { UserMultiple } from "@vicons/carbon";
import { ReloadOutline, SearchOutline } from "@vicons/ionicons5";
import { DataTableColumns, NButton } from "naive-ui";

const capacityUsageRef = ref();
onMounted(async () => {
  await drawCapacityUsage(capacityUsageRef.value, usageData);
});
const usageData: Array<IBaseChartData> = reactive([
  {
    name: "零件1",
    value: 2000,
  },
  {
    name: "零件2",
    value: 3000,
  },
  {
    name: "零件3",
    value: 5000,
  },
  {
    name: "零件4",
    value: 800,
  },
  {
    name: "零件5",
    value: 1200,
  },
  {
    name: "未使用",
    value: 8000,
  },
]);
const detialInfo: IHouseDetialInfo = reactive({
  houseName: "1号仓库",
  houseId: "7af5831cb5",
  houseAddr: "xx市xx区xx厂区",
  houseType: "生产原料仓库",
  capacity: 30000,
  status: {
    label: "primary",
    value: "运行中",
  },
  houseArea: 2000,
  houseAdmin: "张三",
  houseStaff: [
    "李四",
    "王五",
    "老六",
    "老七",
    "老八",
    "小三",
    "小四",
    "小屋",
    "小刘",
    "小王",
  ],
});
const tableQuery: IQuery = reactive({
  type: null,
  keyWord: "",
  startDate: "",
  endDate: "",
});
const queryOptions = [
  {
    label: "生产原料仓库",
    value: "生产原料仓库",
  },
  {
    label: "其它物料仓库",
    value: "其它物料仓库",
  },
  {
    label: "成品存储仓库",
    value: "成品存储仓库",
  },
  {
    label: "其它类型",
    value: "其它类型",
  },
];

//dataTable
const createTableColumn = ({
  handleData,
}: {
  handleData: (rowData: IODetialData) => void;
}): DataTableColumns<IODetialData> => {
  return [
    {
      title: "仓库",
      key: "host",
    },
    {
      title: "仓库编号",
      key: "logID",
    },
    {
      title: "货物名称",
      key: "name",
    },
    {
      title: "数量",
      key: "count",
    },
    {
      title: "状态",
      key: "status",
    },
    {
      title: "时间",
      key: "time",
    },
    {
      title: "经手人",
      key: "principal",
    },
    {
      title: "备注",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render(row) {
        return h(
          NButton,
          {
            text: true,
            type: "error",
            onClick: () => handleData(row),
          },
          { default: () => "删除" }
        );
      },
    },
  ];
};
const tableColumn = createTableColumn({
  handleData(rowData: IODetialData) {
    console.log(rowData);
  },
});
const tableData: IODetialData[] = [
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
  {
    host: "一号仓库",
    logID: "12318719347",
    name: "零件1",
    count: 1220,
    status: "入库",
    time: "2022-9-1",
    principal: "老六",
    remark: "无",
  },
];
const pagination = reactive({
  page: 1,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [5, 10, 15, 20],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

// Modal
const updateInfoModal = ref<boolean>(false);
const isTrading = ref<boolean>(false); //是否为出入口操作标志
const isPersonnelChange = ref<boolean>(false);
const minCapacity = computed(() => {
  return Math.round(detialInfo.houseArea * 0.3 * 50);
});
const maxCapacity = computed(() => {
  return Math.round(detialInfo.houseArea * 0.6 * 50);
});
const actionName = ref<string>("信息修改");
const houseAdminOptions: Array<string> = reactive([]);
const houseStaffOptions: Array<string> = reactive([]);
const emptyForm = () => {
  return {
    baseInfo: {
      houseAddr:"",
      houseArea:0,
      houseType:"",
      status:{
        label:"",
        value:""
      },
      capacity:0
    },
    personnel: {
      houseAdmin:"",
      houseStaff:[""]
    },
    trading: {
      houst: "",
      logID: "",
      name: "",
      count: 0,
      status: "",
      time: "",
      principal: "",
      remark: "",
    },
  };
};
const modalForm = reactive(emptyForm());
function openModal(action: string): void {
  actionName.value = action;
  switch (action) {
    case "修改基本信息":
      const { houseAddr, houseArea, houseType, status, capacity } = detialInfo;
      modalForm.baseInfo = {
        houseAddr,
        houseArea,
        houseType,
        status,
        capacity,
      };
      isTrading.value = false;
      isPersonnelChange.value = false;
      break;
    case "人员变动":
      const { houseAdmin, houseStaff } = detialInfo;
      modalForm.personnel = { houseAdmin, houseStaff };
      isTrading.value = false;
      isPersonnelChange.value = true;
      break;
    default:
      isTrading.value = true;
      isPersonnelChange.value = true;
      break;
  }
  updateInfoModal.value = true;
}
function closeModal(): void {
  Object.assign(modalForm, emptyForm());
  isTrading.value=false;
  isPersonnelChange.value = false;
  
}
</script>
<template>
  <n-grid :cols="5" x-gap="15px" y-gap="15px">
    <n-gi span="2">
      <n-card embedded title="仓库基本信息">
        <n-descriptions label-placement="left" content-style="" :column="1">
          <n-descriptions-item label="仓库名称">
            <n-text>{{ detialInfo.houseName }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库编号">
            <n-text>{{ detialInfo.houseId }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库地址">
            <n-text>{{ detialInfo.houseAddr }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库类型">
            <n-text>{{ detialInfo.houseType }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库容量">
            <n-text>{{ detialInfo.capacity + "单位" }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库面积">
            <n-text>{{ detialInfo.houseArea + "平方米" }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库负责人">
            <n-tag type="error" round style="cursor: pointer">{{
              detialInfo.houseAdmin
            }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="仓库状态">
            <n-tag :bordered="false" :type="detialInfo.status.label" round>
              <n-text>{{ detialInfo.status.value }}</n-text>
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="仓库员工">
            <n-space>
              <n-tag
                v-for="(staff, index) in detialInfo.houseStaff"
                :key="index"
                type="info"
                round
                style="cursor: pointer"
                >{{ staff }}</n-tag
              >
            </n-space>
          </n-descriptions-item>
        </n-descriptions>
        <template #footer>
          <n-space justify="center">
            <n-button-group>
              <n-button round @click="openModal('修改基本信息')">
                <n-icon size="20">
                  <edit />
                </n-icon>
                信息修改
              </n-button>
              <n-button @click="openModal('货物入库')">
                <n-icon size="20">
                  <ICInput />
                </n-icon>
                货物入库
              </n-button>
              <n-button @click="openModal('货物出库')">
                <n-icon size="20">
                  <ICOutput />
                </n-icon>
                货物出库
              </n-button>
              <n-button round @click="openModal('人员变动')">
                <n-icon size="20">
                  <UserMultiple />
                </n-icon>
                人员变动
              </n-button>
            </n-button-group>
          </n-space>
        </template>
      </n-card>
    </n-gi>
    <n-gi span="3">
      <n-card style="height: 100%" title="仓库容量使用详情" embedded>
        <div ref="capacityUsageRef" class="canvas"></div>
      </n-card>
    </n-gi>
    <n-gi span="5">
      <n-card title="进出库记录">
        <n-space style="margin-bottom: 20px">
          <n-select
            v-model:value="tableQuery.type"
            :options="queryOptions"
            placeholder="筛选条件"
            style="width: 200px"
          />
          <n-input v-model:value="tableQuery.keyWord" placeholder="关键字" />
          <n-date-picker type="daterange"></n-date-picker>
          <n-button type="primary" secondary>
            <template #icon>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
            搜索
          </n-button>
          <n-button secondary>
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            重置
          </n-button>
        </n-space>
        <n-data-table
          :columns="tableColumn"
          :data="tableData"
          :pagination="pagination"
          :max-height="474"
        />
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal v-model:show="updateInfoModal" @after-leave="closeModal">
    <n-card style="width: 30vw" :title="actionName" id="modalCard">
      <n-form :model="modalForm">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item label="当前仓库是" v-if="isTrading">{{
            detialInfo.houseName
          }}</n-descriptions-item>
          <n-descriptions-item label="仓库编号">{{
            detialInfo.houseId
          }}</n-descriptions-item>
        </n-descriptions>
        <n-divider />
        <div v-if="!isTrading && !isPersonnelChange">
          <n-form-item label="仓库名称">
            <n-input v-model:value="detialInfo.houseName" />
          </n-form-item>
          <n-form-item label="仓库地址">
            <n-input v-model:value="detialInfo.houseAddr" />
          </n-form-item>
          <n-form-item label="仓库容量">
            <n-input-number
              v-model:value="detialInfo.capacity"
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
          <n-form-item label="仓库面积">
            <n-input-number v-model:value="detialInfo.houseArea" />
          </n-form-item>
          <n-form-item label="仓库状态">
            <n-select v-model:value="detialInfo.status.value" :options="[]" />
          </n-form-item>
          <n-form-item label="仓库类型">
            <n-select v-model:value="detialInfo.houseType" :options="[]" />
          </n-form-item>
        </div>
        <div v-if="isPersonnelChange">
          <n-form-item label="仓库负责人">
            <n-select
              v-model:value="detialInfo.houseAdmin"
              placeholder="请选择仓库负责人"
              :options="houseAdminOptions"
            />
          </n-form-item>
          <n-form-item label="仓库员工">
            <n-select
              v-model:value="detialInfo.houseStaff"
              multiple
              :options="houseStaffOptions"
              :max-tag-count="4"
            />
          </n-form-item>
        </div>
        <div v-if="isTrading">
          <n-form-item></n-form-item>
        </div>
        <n-space justify="end">
          <n-button type="primary" v-if="!isTrading">修改</n-button>
          <n-button type="primary" v-else>确定</n-button>
          <n-button @click="updateInfoModal = false">取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
.n-card {
  border-radius: 15px;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas {
  width: 80%;
  height: 100%;
  padding: 0 10%;
}
#modalCard {
  ::v-deep .n-card__content {
    max-height: 500px;
    overflow-y: scroll;
    scrollbar-width: none;
    position: relative;
  }
  ::v-deep .n-card__content::-webkit-scrollbar {
    display: none;
  }
}
</style>
