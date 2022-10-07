<script setup lang="ts">
import { SearchOutline, ReloadOutline } from "@vicons/ionicons5";
import { PlusOutlined } from "@vicons/material";
import { DataTableColumns, NSpace, NButton } from "naive-ui";

import { h, reactive, ref } from "vue";
import { IStaffQuery, IStaffTableData } from "../../interface/dataModel";

const tableQuery: IStaffQuery = reactive({
  keyWord: "",
  queryType: "",
});
const queryOptions = [
  {
    label: "类型1",
    value: "123",
  },
];

/*** dataTable ***/
const createTableColumn = ({
  viewStaff,
  delStaff
}:{
  viewStaff:(rowData:IStaffTableData) => void;
  delStaff:(rowData:IStaffTableData) => void;
}):DataTableColumns<IStaffTableData> => {
  return [
    {
      title:"工号",
      key:"wno",
    },
    {
      title:"姓名",
      key:"usrName"
    },
    {
      title:"性别",
      key:"sex"
    },
    {
      title:"员工类型",
      key:"usrType"
    },
    {
      title:"工作仓库",
      key:"warehouse"
    },
    {
      title:"操作",
      key:"action",
      render(row){
        return h(NSpace,() => [
          h(
            NButton,
            {
              text:true,
              type:"info",
              onClick:() => viewStaff(row)
            },
            { default: () => "详情" }
          ),
          h(
            NButton,
            {
              text:true,
              type:"error",
              onClick:() => delStaff(row)
            },
            { default: () => "删除员工"}
          )
        ])
      }
    }
  ]
};
const tableColumn = createTableColumn({
  viewStaff(rowData){},
  delStaff(rowData){}
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
const tableData = ref<Array<IStaffTableData>>([])
</script>
<template>
  <n-grid :cols="1">
    <n-gi>
      <n-card title="员工管理">
        <n-space>
          <n-select
            v-model:vaklue="tableQuery.queryType"
            :options="queryOptions"
            placeholder="关键字类型"
            style="width:180px"
          />
          <n-input v-model:value="tableQuery.keyWord" placeholder="关键字" />
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
          <n-button type="primary" secondary>
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
</template>
<style scoped lang="scss"></style>
