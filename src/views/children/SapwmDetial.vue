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
import {
  DataTableColumns,
  FormInst,
  FormItemRule,
  NButton,
  useMessage,
} from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { baseAxios } from "../../const";
import { IHouseType, IMember, IWarehouseBSInfo } from "../../api/data";

const message = useMessage();
const router = useRouter();
const route = useRoute();

const capacityUsageRef = ref();
async function loadBaseInfo() {
  baseAxios
    .get(`/warehouse/detial/queryBaseInfo?id=${route.params.id}`)
    .then((res) => {
      console.log(res);
      const {
        hid,
        houseName,
        houseAddr,
        houseArea,
        htid,
        typeName,
        hsid,
        value,
        style,
        member,
        capacity,
      } = res.data.result;
      let admin;
      let staff: Array<IMember> = [];
      member.forEach((m: IMember) => {
        m.usrType === "staff"
          ? staff.push(m)
          : (admin = { uid: m.uid, usrName: m.usrName });
      });
      console.log(admin);

      const data = {
        houseName,
        houseId: hid,
        houseAddr,
        houseType: {
          htid,
          typeName,
        },
        capacity,
        status: {
          hsid,
          label: style,
          value,
        },
        houseArea,
        houseAdmin: admin,
        houseStaff: staff,
      };
      Object.assign(detialInfo, data);
    });
}
function loadStatusList() {
  baseAxios.get("/warehouse/detial/getWarehouseStatus").then((res) => {
    houseStatusOptions.value = res.data.result;
  });
}
function loadTypeList() {
  baseAxios.get("/warehouse/getHouseTypeList").then((res) => {
    houseTypeOptions.value = res.data.result;
  });
}
onMounted(async () => {
  //await drawCapacityUsage(capacityUsageRef.value, usageData);
  loadBaseInfo();
  loadStatusList();
  loadTypeList();
});
const usageData: Array<IBaseChartData> = reactive([]);
const detialInfo: IHouseDetialInfo = reactive({
  houseName: "",
  houseId: "",
  houseAddr: "",
  houseType: {
    htid: -1,
    typeName: "",
  },
  capacity: -1,
  status: {
    hsid: -1,
    label: "",
    value: "",
  },
  houseArea: -1,
  houseAdmin: {
    uid: "",
    usrName: "",
  },
  houseStaff: [],
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
const baseInfoModal = ref<boolean>(false);
const baseInfoFormRef = ref<FormInst | null>(null);
const minCapacity = computed(() => {
  return Math.round((baseInfoForm.houseArea as number) * 0.3 * 50);
});
const maxCapacity = computed(() => {
  return Math.round((baseInfoForm.houseArea as number) * 0.6 * 50);
});

const houseAdminOptions: Array<string> = reactive([]);
const houseStaffOptions: Array<string> = reactive([]);
const houseStatusOptions = ref<Array<IHouseType>>([]);
const houseTypeOptions = ref<Array<IHouseType>>([]);
const modalRules = {
  houseName: {
    key: "baseInfo",
    required: true,
    message: "请输入仓库名称",
    trigger: blur,
  },
  houseAddr: {
    key: "baseInfo",
    required: true,
    message: "请输入仓库地址",
    trigger: blur,
  },
  houseArea: {
    key: "baseInfo",
    type: "number",
    required: true,
    message: "请输入仓库面积",
    trigger: blur,
  },
  capacity: [
    {
      key: "baseInfo",
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (value === 0) {
          return new Error("请输入仓库容量");
        }
      },
      trigger: blur,
    },
    {
      key: "baseInfo",
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (baseInfoForm.houseArea === 0) {
          return new Error("请先输入仓库面积");
        }
        return true;
      },
      trigger: "input",
    },
  ],
};
const baseInfoForm: IWarehouseBSInfo = reactive({
  houseName: null,
  houseAddr: null,
  houseArea: null,
  houseId: null,
  hsid: null,
  htid: null,
  capacity: null,
});
function openBaseInfoModal() {
  baseInfoModal.value = true;
  Object.keys(baseInfoForm).map((key) => {
    if (Object.keys(detialInfo).includes(key)) {
      baseInfoForm[key] = detialInfo[key] as string | number;
    }
  });
  const { htid } = detialInfo.houseType;
  const { hsid } = detialInfo.status;
  baseInfoForm.hsid = hsid;
  baseInfoForm.htid = htid;
}
function closeBaseInfoModal() {
  Object.keys(baseInfoForm).map((key) => {
    baseInfoForm[key] = null;
  });
}
function updateBaseInfo() {
  baseInfoFormRef.value?.validate((err) => {
    if (!err) {
      baseAxios
        .post("/warehouse/detial/updateBaseInfo", { ...baseInfoForm })
        .then((res) => {
          loadBaseInfo();
          message.success(res.data.message);
        })
        .catch((err) => {
          message.error(err);
        })
        .finally(() => {
          baseInfoModal.value = false;
        });
    }
  });
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
            <n-text>{{ detialInfo.houseType.typeName }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库容量">
            <n-text>{{ detialInfo.capacity + "单位" }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库面积">
            <n-text>{{ detialInfo.houseArea + "平方米" }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="仓库负责人">
            <n-tag round v-if="!detialInfo.houseAdmin">未指定负责人</n-tag>
            <n-tag round type="error" style="cursor: pointer" v-else>{{
              detialInfo.houseAdmin.usrName
            }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="仓库状态">
            <n-tag :bordered="false" :type="detialInfo.status.label" round>
              {{ detialInfo.status.value }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="仓库员工">
            <n-space>
              <n-tag round v-if="detialInfo.houseStaff.length === 0"
                >未添加仓库员工</n-tag
              >
              <n-tag
                v-for="(staff, index) in detialInfo.houseStaff"
                :key="index"
                type="info"
                round
                style="cursor: pointer"
                v-else
                >{{ staff.usrName }}</n-tag
              >
            </n-space>
          </n-descriptions-item>
        </n-descriptions>
        <template #footer>
          <n-space justify="center">
            <n-button-group>
              <n-button round @click="openBaseInfoModal">
                <n-icon size="20">
                  <edit />
                </n-icon>
                信息修改
              </n-button>
              <n-button>
                <n-icon size="20">
                  <ICInput />
                </n-icon>
                货物入库
              </n-button>
              <n-button>
                <n-icon size="20">
                  <ICOutput />
                </n-icon>
                货物出库
              </n-button>
              <n-button round>
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
        <div
          ref="capacityUsageRef"
          class="canvas"
          v-if="usageData.length > 0"
        ></div>
        <n-space v-else justify="center" align="center" style="height: 100%">
          <n-empty size="huge"></n-empty>
        </n-space>
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
  <n-modal v-model:show="baseInfoModal" @after-leave="closeBaseInfoModal">
    <n-card style="width: 30vw" title="修改基本信息" id="modalCard">
      <n-form :model="baseInfoForm" ref="baseInfoFormRef" :rules="modalRules">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item label="当前仓库是">{{
            detialInfo.houseName
          }}</n-descriptions-item>
          <n-descriptions-item label="仓库编号">{{
            detialInfo.houseId
          }}</n-descriptions-item>
        </n-descriptions>
        <n-divider />
        <n-form-item label="仓库名称" path="houseName">
          <n-input v-model:value="baseInfoForm.houseName" />
        </n-form-item>
        <n-form-item label="仓库地址" path="houseAddr">
          <n-input v-model:value="baseInfoForm.houseAddr" />
        </n-form-item>
        <n-form-item label="仓库面积" path="houseArea">
          <n-input-number
            min="0"
            style="width: 100%"
            v-model:value="baseInfoForm.houseArea"
          >
            <template #suffix>
              <span style="color: #afb0b2">平方米</span>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="仓库容量" path="capacity">
          <n-input-number
            :min="minCapacity"
            :max="maxCapacity"
            step="1000"
            :precision="0"
            style="width: 100%"
            v-model:value="baseInfoForm.capacity"
          >
            <template #suffix>
              <span style="color: #afb0b2">单位</span>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="仓库状态">
          <n-select
            :options="houseStatusOptions"
            value-field="hsid"
            label-field="value"
            v-model:value="baseInfoForm.hsid"
          />
        </n-form-item>
        <n-form-item label="仓库类型">
          <n-select
            :options="houseTypeOptions"
            value-field="htid"
            label-field="typeName"
            v-model:value="baseInfoForm.htid"
          />
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" @click="updateBaseInfo">修改</n-button>
          <n-button @click="baseInfoModal = false">取消</n-button>
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
