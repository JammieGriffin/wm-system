<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from "vue";
import {
  IBaseChartData,
  IHouseDetialInfo,
  IODetialData,
  IQuery,
  ITradingForm,
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
import {
  IHouseType,
  IMember,
  ITradingRecord,
  IWarehouseBSInfo,
} from "../../api/data";

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
const usageData = ref<Array<IBaseChartData>>([]);
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
const tableData = ref<Array<IODetialData>>([]);
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
// tradingModal
const tradingModal = ref<boolean>(false);
const tradingName = ref<string>("");
const materialOption = ref<Array<{ cid: string; cname: string }>>([]);
const existMaterialOption = ref<Array<{ cid: string; cname: string }>>([]);
const handlerOption = ref<Array<{ uid: string; usrName: string }>>([]);
const usageCapacity = ref<number>(0);
const popQuantity = ref<number>(0);
const isPop = ref<boolean>(false);
const surplusCapacity = computed(() => {
  return detialInfo.capacity - usageCapacity.value;
});

const tradingForm: ITradingForm = reactive({
  cid: null,
  handler: null,
  quantity: null,
  remark: null,
  isPop: null,
});

function closeTardingModal() {
  Object.keys(tradingForm).map((key: string) => {
    tradingForm[key] = null;
  });
}
async function getHouseStaffs() {
  const hid = route.params.id;
  baseAxios
    .get("/warehouse/detial/getHouseStaffs", {
      params: { hid },
    })
    .then((res) => {
      handlerOption.value = res.data.result;
    })
    .catch((err) => {
      message.error(err);
    });
}
async function getCargos() {
  baseAxios
    .get("/warehouse/detial/getCargos")
    .then((res) => {
      materialOption.value = res.data.result;
    })
    .catch((err) => {
      message.error(err);
    });
}
async function getUsageCapactiy() {
  const hid = route.params.id;
  baseAxios
    .get("/warehouse/detial/getUsageCapactiy", { params: { hid } })
    .then((res) => {
      const { total } = res.data;
      total ? (usageCapacity.value = total) : (usageCapacity.value = 0);
    })
    .catch((err) => {
      message.error(err);
    });
}
async function getExistCargos() {
  const hid = route.params.id;
  baseAxios
    .get("/warehouse/detial/getExistCargos", { params: { hid } })
    .then((res) => {
      if (res.data.result) {
        existMaterialOption.value = res.data.result;
      }
    })
    .catch((err) => {
      message.error(err);
    });
}
async function getTradingRecord() {
  const hid = route.params.id;
  baseAxios
    .get("/warehouse/detial/getTradingRecord", { params: { hid } })
    .then((res) => {
      res.data.result.forEach((record: ITradingRecord) => {
        const { cname, count, hid, houseName, isPop, remark, usrName } = record;
        const time = new Date(record.time).toLocaleString();
        const status = isPop === 1 ? "出库" : "入库";
        tableData.value.push({
          host: houseName,
          name: cname,
          count,
          status,
          time,
          principal: usrName,
          remark,
        });
      });
    });
}
async function getUsageData() {
  const hid = route.params.id;
  await baseAxios
    .get("/warehouse/detial/getStoreInfo", { params: { hid } })
    .then((res) => {
      usageData.value = [];
      res.data.result.forEach((data: { cname: string; count: number }) => {
        const { cname, count } = data;
        usageData.value.push({
          name: cname,
          value: count,
        });
      });
      usageData.value.push({
        name: "未使用",
        value: surplusCapacity.value,
      });
    });
}
onMounted(async () => {
  await getHouseStaffs();
  await getCargos();
  await getUsageCapactiy();
  await getExistCargos();
  await getTradingRecord();
  await getUsageData()
  await drawCapacityUsage(capacityUsageRef.value, usageData.value);
  

  
});
function openTradingModal(isPop_: boolean) {
  isPop_
    ? (() => {
        tradingName.value = "货物出库";
        tradingForm.isPop = 1;
      })()
    : (() => {
        tradingName.value = "货物入库";
        tradingForm.isPop = 0;
      })();
  isPop.value = isPop_;
  tradingModal.value = true;
}
function onTrading() {
  const hid = route.params.id;
  baseAxios
    .post("/warehouse/detial/trading", { ...tradingForm, hid })
    .then(async (res) => {
      message.success(res.data.message);
      getExistCargos();
      getTradingRecord();
      await getUsageData();
      await drawCapacityUsage(capacityUsageRef.value,usageData.value);
    })
    .catch((err) => {
      message.error(err);
    })
    .finally(() => {
      tradingModal.value = false;
    });
}
function getDeliverableQuantity(cid: string) {
  const hid = route.params.id;
  baseAxios
    .get("/warehouse/detial/getDeliverableQuantity", {
      params: { cid, hid },
    })
    .then((res) => {
      popQuantity.value = res.data.count;
    })
    .catch((err) => {
      message.error(err);
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
              <n-button @click="openTradingModal(false)">
                <n-icon size="20">
                  <ICInput />
                </n-icon>
                货物入库
              </n-button>
              <n-button @click="openTradingModal(true)">
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
        <div ref="capacityUsageRef" class="canvas"></div>
        <!-- <div v-show="usageData.length === 0">
          <n-empty></n-empty>
        </div> -->
      </n-card>
    </n-gi>
    <n-gi span="5">
      <n-card title="当前仓库进出库记录">
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
  <n-modal v-model:show="tradingModal" @after-leave="closeTardingModal">
    <n-card style="width: 30vw" :title="tradingName">
      <n-form :model="tradingForm" ref="tradingFormRef">
        <n-form-item label="物料名称">
          <n-select
            v-model:value="tradingForm.cid"
            :options="materialOption"
            placeholder="请选择物料"
            filterable
            label-field="cname"
            value-field="cid"
            v-if="!isPop"
          />
          <n-select
            v-model:value="tradingForm.cid"
            :options="existMaterialOption"
            placeholder="请选择物料"
            filterable
            label-field="cname"
            value-field="cid"
            @update:value="getDeliverableQuantity"
            v-else
          />
        </n-form-item>
        <n-form-item label="经手人">
          <n-select
            v-model:value="tradingForm.handler"
            :options="handlerOption"
            placeholder="请选择经手人"
            label-field="usrName"
            value-field="uid"
          />
        </n-form-item>
        <n-form-item label="物料数量">
          <n-input-number
            :precision="0"
            style="width: 100%"
            v-model:value="tradingForm.quantity"
            :min="0"
            :max="surplusCapacity"
            v-if="!isPop"
          >
            <template #suffix>
              <span style="color: #afb0b2">单位</span>
            </template>
          </n-input-number>
          <n-input-number
            :precision="0"
            style="width: 100%"
            v-model:value="tradingForm.quantity"
            :min="0"
            :max="popQuantity"
            v-else
          >
            <template #suffix>
              <span style="color: #afb0b2">单位</span>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="备注">
          <n-input
            type="textarea"
            max-length="100"
            v-model:value="tradingForm.reamrk"
          />
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" @click="onTrading">确定</n-button>
          <n-button @click="tradingModal = false">取消</n-button>
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
