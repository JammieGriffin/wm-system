<script setup lang="ts">
import { SearchOutline, ReloadOutline } from "@vicons/ionicons5";
import { PlusOutlined } from "@vicons/material";
import {
  DataTableColumns,
  NSpace,
  NButton,
  FormItemRule,
  useMessage,
} from "naive-ui";

import { h, onMounted, reactive, ref } from "vue";
import { IHouse, IStaff } from "../../api/data";
import { baseAxios } from "../../const";
import {
  IStaffInfo,
  IStaffQuery,
  IStaffTableData,
  IWarehouseInfo,
  IAllocForm,
} from "../../interface/dataModel";

const message = useMessage();

const tableQuery: IStaffQuery = reactive({
  keyWord: null,
  queryType: null,
});
const queryOptions = [
  {
    label: "工号",
    value: "wno",
  },
  {
    label: "姓名",
    value: "usrName",
  },
  {
    label: "联系电话",
    value: "phone",
  },
  {
    label: "工作仓库",
    value: "warehouse",
  },
];
function initQuery() {
  Object.keys(tableQuery).map((key) => {
    tableQuery[key] = null;
  });
  pagination.page = 1;
  getStaffs();
}
function onQuery() {
  const { keyWord, queryType } = tableQuery;
  if (!queryType && keyWord) {
    message.error("请选择关键字的类型");
  } else if (queryType && !keyWord) {
    message.error("请输入搜索关键字");
  } else {
    pagination.page = 1;
    getStaffs();
  }
}
/*** dataTable ***/
const createTableColumn = ({
  allocMission,
  delStaff,
}: {
  allocMission: (rowData: IStaffTableData) => void;
  delStaff: (rowData: IStaffTableData) => void;
}): DataTableColumns<IStaffTableData> => {
  return [
    {
      title: "工号",
      key: "wno",
    },
    {
      title: "姓名",
      key: "usrName",
    },
    {
      title: "性别",
      key: "sex",
    },
    {
      title: "员工类型",
      key: "usrType",
    },
    {
      title: "联系电话",
      key: "phone",
    },
    {
      title: "工作仓库",
      key: "houseName",
    },
    {
      title: "操作",
      key: "action",
      render(row) {
        return h(NSpace, () => [
          h(
            NButton,
            {
              text: true,
              type: "info",
              onClick: () => allocMission(row),
            },
            { default: () => "分配仓库" }
          ),
          h(
            NButton,
            {
              text: true,
              type: "error",
              onClick: () => delStaff(row),
            },
            { default: () => "删除员工" }
          ),
        ]);
      },
    },
  ];
};
const tableColumn = createTableColumn({
  allocMission(rowData) {
    console.log(rowData);
    const keys = Object.keys(allocForm);
    Object.keys(rowData).map((key) => {
      if (keys.includes(key)) {
        allocForm[key] = rowData[key];
      }
      allocForm.currentHid = rowData.hid;
      allocForm.currentHouseName = rowData.warehouseName;
      allocForm.isPrincipal = rowData.usrType !== "普通员工";
      allocModal.value = true;
    });
  },
  async delStaff(rowData) {
    Promise.all([
      baseAxios.delete("/sys/del", { params: { uid: rowData.uid } }),
      baseAxios.delete("/staff/delAllocRelation", {
        params: { uid: rowData.uid },
      }),
    ])
    .then(() => {
      getStaffs();
      message.success("删除成功")
    })
    .catch(() => {
      message.error("删除失败")
    })

  },
});
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
const tableData = ref<Array<IStaff>>([]);

/*** modal ***/
const addStaff = ref<boolean>(false);
function initStaffForm() {
  Object.keys(staffForm).map((key) => {
    staffForm[key] = null;
  });
}
const staffForm: IStaffInfo = reactive({
  usrName: null,
  wno: null,
  sex: null,
  phone: null,
  usrType: null,
});
const staffFormRules: FormItemRule = {};
const sexOptions: Array<{ label: string; value: string }> = [
  {
    label: "男",
    value: "男",
  },
  {
    label: "女",
    value: "女",
  },
];
const typeOptions: Array<{ label: string; value: string }> = [
  {
    label: "普通员工",
    value: "staff",
  },
  {
    label: "仓库负责人",
    value: "principal",
  },
];
const warehouseOptions: Array<{ label: string; value: string | null }> = [
  {
    label: "未分配",
    value: null,
  },
];
function onAdd() {
  baseAxios
    .post("/staff/addStaff", { ...staffForm })
    .then((res) => {
      message.success(res.data.message);
      addStaff.value = false;
      getStaffs();
    })
    .catch((err) => {
      message.error(err);
    });
}
function getStaffs() {
  tableData.value = [];
  baseAxios
    .get("/staff/getStaffInfo", {
      params: { ...tableQuery },
    })
    .then((res) => {
      res.data.result.forEach((staff: IStaff) => {
        staff.houseName === null ? (staff.houseName = "未分配") : () => {};
        staff.usrType === "staff"
          ? (staff.usrType = "普通员工")
          : (staff.usrType = "仓库负责人");
        tableData.value.push(staff);
      });
    });
}
function getWareHouseList() {
  baseAxios.get("/warehouse/getWarehouseList").then((res) => {
    console.log(res);
    res.data.result.forEach((house: IHouse) => {
      const { hid, houseName } = house;
      warehouseOptions.push({
        label: houseName,
        value: hid,
      });
    });
  });
}
const allocModal = ref<boolean>(false);
const allocForm: IAllocForm = reactive({
  hid: "",
  currentHid: null,
  currentHouseName: null,
  houseName: "",
  uid: "",
  usrName: "",
  wno: "",
  isPrincipal: null,
});
function initAllocForm() {
  Object.keys(allocForm).map((key) => {
    allocForm[key] = null;
  });
}
function onAlloc() {
  console.log(allocForm);
  if (!allocForm.hid && !allocForm.currentHid) {
    allocModal.value = false;
  } else {
    baseAxios
      .post("/staff/allocWarehouse", { ...allocForm })
      .then((res) => {
        message.success(res.data.message);
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        getStaffs();
        allocModal.value = false;
      });
  }
}
onMounted(() => {
  getStaffs();
  getWareHouseList();
});
</script>
<template>
  <n-grid :cols="1">
    <n-gi>
      <n-card title="员工管理">
        <n-space>
          <n-select
            v-model:value="tableQuery.queryType"
            :options="queryOptions"
            placeholder="关键字类型"
            style="width: 180px"
          />
          <n-input v-model:value="tableQuery.keyWord" placeholder="关键字" />
          <n-button type="primary" secondary @click="onQuery">
            <template #icon>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
            搜索
          </n-button>
          <n-button secondary @click="initQuery">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            重置
          </n-button>
          <n-button type="primary" secondary @click="addStaff = true">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加员工信息
          </n-button>
        </n-space>
        <n-divider />
        <n-data-table
          :columns="tableColumn"
          :data="tableData"
          :pagination="pagination"
          :max-height="474"
        />
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal v-model:show="addStaff" @after-leave="initStaffForm">
    <n-card style="width: 30vw" title="添加员工信息">
      <n-form :model="staffForm">
        <n-form-item label="员工姓名">
          <n-input
            v-model:value="staffForm.usrName"
            placeholder="请输入员工姓名"
          />
        </n-form-item>
        <n-form-item label="工号">
          <n-input v-model:value="staffForm.wno" placeholder="请输入工号" />
        </n-form-item>
        <n-form-item label="联系电话">
          <n-input
            v-model:value="staffForm.phone"
            placeholder="请输入联系电话"
          />
        </n-form-item>
        <n-form-item label="性别">
          <n-select
            v-model:value="staffForm.sex"
            :options="sexOptions"
            placeholder="请选择员工性别"
          />
        </n-form-item>
        <n-form-item label="员工类型">
          <n-select
            v-model:value="staffForm.usrType"
            :options="typeOptions"
            placeholder="请选择员工类型"
          />
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" @click="onAdd">添加</n-button>
          <n-button @click="addStaff = false">取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
  <n-modal v-model:show="allocModal" @after-leave="initAllocForm">
    <n-card style="width: 30vw">
      <n-form :model="allocForm">
        <n-descriptions :columns="1" label-placement="left">
          <n-descriptions-item label="员工编号">
            {{ allocForm.uid }}
          </n-descriptions-item>
          <n-descriptions-item label="员工工号">{{
            allocForm.wno
          }}</n-descriptions-item>
          <n-descriptions-item label="员工姓名">{{
            allocForm.usrName
          }}</n-descriptions-item>
          <n-descriptions-item label="当前工作仓库编号">{{
            allocForm.currentHid
          }}</n-descriptions-item>
          <n-descriptions-item label="当前工作仓库名称">{{
            allocForm.currentHouseName
          }}</n-descriptions-item>
        </n-descriptions>
        <n-divider />
        <n-form-item label="工作仓库">
          <n-select
            v-model:value="allocForm.hid"
            :options="warehouseOptions"
          ></n-select>
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" @click="onAlloc">确定</n-button>
          <n-button @click="allocModal = false">取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
</template>
<style scoped lang="scss">
.n-card {
  border-radius: 15px;
}
</style>
