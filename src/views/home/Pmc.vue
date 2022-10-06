<script setup lang="ts">
import { SearchOutline, ReloadOutline } from "@vicons/ionicons5";
import { PlusOutlined } from "@vicons/material";
import {
  DataTableColumns,
  NButton,
  NTag,
  NSpace,
  useMessage,
  FormInst,
} from "naive-ui";
import { h, onBeforeMount, onMounted, reactive, ref, VNode } from "vue";
import { ICargoType } from "../../api/data";
import { baseAxios } from "../../const";
import {
  IPmcForm,
  IPmcFormOption,
  IPmcTableData,
  IPmcTableQuery,
} from "../../interface/dataModel";
const message = useMessage();
const tableQuery: IPmcTableQuery = reactive({
  ctid: null,
  keyWord: null,
});

function initScreen() {
  tableQuery.ctid = null;
  tableQuery.keyWord = null;
  loadMaterialList();
}
function loadMaterialTypes() {
  baseAxios.get("/pmc/getUsageCargoTypes").then((res) => {
    if(materialTypes.value) materialTypes.value = [];
    res.data.result.forEach((tag: ICargoType) => {
      materialTypes.value.push({
        label: tag.typeName,
        value: tag.num,
        ctid: tag.ctid,
      });
    });
  });
  baseAxios.get("/pmc/getAllCargoTypes").then((res) => {
    Object.assign(formOptions, res.data.result);
  });
}
function loadMaterialList() {
  const { ctid, keyWord } = tableQuery;
  const { page, pageSize } = pagination;
  baseAxios
    .get("/pmc/getCargos", {
      params: { ctid, keyWord, page, pageSize },
    })
    .then((res) => {
      if (tableData.value) tableData.value = [];
      res.data.result.forEach((cargo: any) => {
        const { cid, cname, tags } = cargo;
        tableData.value.push({ cid, cargoName: cname, tags });
      });
    })
    .catch((err) => {
      message.error(err);
    });
}

/*** 添加物料表单 ***/
const formOptions: Array<IPmcFormOption> = reactive([]);
const materialFormRef = ref<FormInst | null>(null);
const addMaterialModal = ref<boolean>(false);
const materialForm: IPmcForm = reactive({
  cname: null,
  tags: null,
});
const materialFormRules = {};

function initForm() {
  Object.keys(materialForm).map((key) => {
    materialForm[key] = null;
  });
}
function onAdd(){
  console.log(materialForm)
  baseAxios.post("/pmc/addCargo",materialForm).then((res) => {
    message.success(res.data.message);
  }).catch((err) => {
    message.error(err)
  }).finally(() => {
    loadMaterialList();
    loadMaterialTypes();
    addMaterialModal.value = false;
  })
}

onMounted(() => {
  loadMaterialTypes();
  loadMaterialList();
});

/*** 物料标签 ***/
//标签列表
const materialTypes = ref<Array<Object>>([]);
//标签渲染
function renderTags(
  tag: { label: string; value: number; ctid: number },
  index: number
) {
  return h(
    NTag,
    {
      type: "info",
      style: "cursor:pointer",
      onClick: () => {
        tableQuery.ctid = tag.ctid;
        pagination.page = 1;
        loadMaterialList();
      },
    },
    { default: () => tag.label + `（${tag.value}）` }
  );
}
function createTags(tag: { label: string; value: number; ctid: number }) {
  return tag;
}

const newTagName = ref<string>("");
const addNewTag = (submit: Function, closeInput: Function) => {
  if (newTagName.value) {
    baseAxios
      .post("/pmc/addCargoType", { typeName: newTagName.value })
      .then((res) => {
        message.success(res.data.message);
        submit({
          label: newTagName.value,
          value: 0,
          ctid: res.data.ctid,
        });
        formOptions.push({
          ctid: res.data.ctid,
          typeName: newTagName.value,
        });
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        newTagName.value = "";
      });
  }
  closeInput();
};
const createTableColumn = ({
  viewDestribution,
  addTags,
}: {
  viewDestribution: (rowData: IPmcTableData) => void;
  addTags: (rowData: IPmcTableData) => void;
}): DataTableColumns<IPmcTableData> => {
  return [
    {
      title: "物料编号",
      key: "cid",
    },
    {
      title: "物料名称",
      key: "cargoName",
    },
    {
      title: "物料总数量",
      key: "quantity",
    },
    {
      title: "物料标签",
      key: "tags",
      render(row) {
        console.log(row);

        const tags: Array<VNode> = [];
        row.tags.forEach((v: { ctid: number; typeName: string }) => {
          const tag = h(
            NTag,
            {
              type: "info",
            },
            { default: () => v.typeName }
          );
          tags.push(tag);
          console.log(tags);
        });
        return h(NSpace, () => [...tags]);
      },
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
              onClick: () => viewDestribution(row),
            },
            { default: () => "查看物料分布" }
          ),
          h(
            NButton,
            {
              text: true,
              type: "primary",
              onClick: () => addTags(row),
            },
            { default: () => "标签管理" }
          ),
        ]);
      },
    },
  ];
};
const tableColumn = createTableColumn({
  viewDestribution(rowData: IPmcTableData) {
    console.log(rowData);
  },
  addTags(rowData: IPmcTableData) {
    console.log(rowData);
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
const tableData = ref<Array<IPmcTableData>>([]);
</script>
<template>
  <n-grid :cols="1">
    <n-gi>
      <n-card title="物料信息">
        <n-space>
          <n-input v-model:value="tableQuery.keyWord" placeholder="关键字" />
          <n-button type="primary" secondary @click="loadMaterialList">
            <template #icon>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
            搜索
          </n-button>
          <n-button secondary @click="initScreen">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            重置
          </n-button>
          <n-button type="primary" secondary @click="addMaterialModal = true">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加物料信息
          </n-button>
        </n-space>
        <n-divider />
        <n-descriptions title="物料标签">
          <n-descriptions-item>
            <n-dynamic-tags
              :render-tag="renderTags"
              @create="createTags"
              tag-style="cursor:pointer"
              type="info"
              :closable="false"
              v-model:value="materialTypes"
            >
              <template #input="{ submit, deactivate }">
                <n-input
                  v-model:value="newTagName"
                  @blur="addNewTag(submit, deactivate)"
                />
              </template>
            </n-dynamic-tags>
          </n-descriptions-item>
        </n-descriptions>
        <n-divider />
        <n-data-table
          :data="tableData"
          :columns="tableColumn"
          :pagination="pagination"
          :max-height="474"
        />
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal v-model:show="addMaterialModal" @after-leave="initForm">
    <n-card style="width: 30vw" title="添加物料信息">
      <n-form
        :model="materialForm"
        ref="materialFormRef"
        :rules="materialFormRules"
      >
        <n-form-item label="物料名称">
          <n-input
            v-model:value="materialForm.cname"
            placeholder="请输入物料名称"
          />
        </n-form-item>
        <n-form-item label="物料标签">
          <n-select
            multiple
            :options="formOptions"
            v-model:value="materialForm.tags"
            label-field="typeName"
            value-field="ctid"
            placeholder="请选择物料标签"
          ></n-select>
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" @click="onAdd">添加</n-button>
          <n-button>取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
</template>
<style lang="scss" scoped>
.n-card {
  border-radius: 15px;
}
</style>
