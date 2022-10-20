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
  useDialog,
} from "naive-ui";
import { h, onBeforeMount, onMounted, reactive, ref, VNode, watch } from "vue";
import { ICargoType } from "../../api/data";
import { baseAxios } from "../../const";
import {
  IBaseChartData,
  IPmcForm,
  IPmcFormOption,
  IPmcTableData,
  IPmcTableQuery,
  IPmcTagManageForm,
} from "../../interface/dataModel";
import { drawDistributionPie } from "../../tools/drawCanvas";
const message = useMessage();
const dialog = useDialog();
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
    if (materialTypes.value) materialTypes.value = [];
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
        const { cid, cname, tags, quantity } = cargo;
        tableData.value.push({ cid, cargoName: cname, tags, quantity });
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
function onAdd() {
  baseAxios
    .post("/pmc/addCargo", materialForm)
    .then((res) => {
      message.success(res.data.message);
    })
    .catch((err) => {
      message.error(err);
    })
    .finally(() => {
      loadMaterialList();
      loadMaterialTypes();
      addMaterialModal.value = false;
    });
}
// chart
const distributeChartRef = ref();
const distributeData = ref<Array<IBaseChartData>>([]);
async function getDistributeData(cid: string) {
  await baseAxios
    .get("/pmc/getDistributeData", { params: { cid } })
    .then((res) => {
      distributeData.value = [];
      res.data.result.forEach((data: { count: number; houseName: string }) => {
        const { count, houseName } = data;
        distributeData.value.push({ name: houseName, value: count });
      });
    });
}
onMounted(async () => {
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
  tagsManage,
  delMaterial,
}: {
  viewDestribution: (rowData: IPmcTableData) => void;
  tagsManage: (rowData: IPmcTableData) => void;
  delMaterial: (rowData: IPmcTableData) => void;
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
        const tags: Array<VNode> = [];
        row.tags.forEach((v: { ctid: number; typeName: string }) => {
          const tag = h(
            NTag,
            {
              type: "info",
            },
            {
              default: () => v.typeName,
              value: () => v.ctid,
            }
          );
          tags.push(tag);
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
              onClick: () => tagsManage(row),
            },
            { default: () => "标签管理" }
          ),
          h(
            NButton,
            {
              text: true,
              type: "error",
              onClick: () => delMaterial(row),
            },
            { default: () => "删除物料" }
          ),
        ]);
      },
    },
  ];
};
async function loadDistributeData(rowData: IPmcTableData) {
  await getDistributeData(rowData.cid);
  await drawDistributionPie(distributeChartRef.value, distributeData.value);
}
function delMaterialBycid(cid: string) {
  baseAxios
    .delete("/pmc/delCargo", { params: { cid } })
    .then((res) => {
      loadMaterialTypes();
      loadMaterialList();
      message.success(res.data.message);
    })
    .catch((err) => {
      message.error(err);
    });
}
const currentRow = ref<IPmcTableData>();
const tableColumn = createTableColumn({
  viewDestribution(rowData: IPmcTableData) {
    currentRow.value = rowData;
    distributeModal.value = true;
  },
  tagsManage(rowData: IPmcTableData) {
    tagManageModal.value = true;
    tagManageForm.cid = rowData.cid;
    tagManageForm.cname = rowData.cargoName;
    const tags = rowData.tags.map((item) => {
      return item.ctid;
    });
    tagManageForm.currentTags = tags;
    tagManageForm.initalTags = tags;
  },
  delMaterial(rowData: IPmcTableData) {
    if (rowData.quantity !== 0) {
      message.error("无法删除还有库存的物料");
      return;
    }
    dialog.warning({
      title: "删除物料",
      content:
        "与该物料相关的出入库记录都会被删除，是否确认删除？此操作不可逆转",
      positiveText: "确定",
      negativeText: "取消",
      maskClosable: false,
      closable: false,
      negativeButtonProps: { type: "default" },
      onPositiveClick: () => {
        delMaterialBycid(rowData.cid);
      },
    });
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

//tableModal
const tagManageModal = ref<boolean>(false);
const tagManageForm: IPmcTagManageForm = reactive({
  cid: "",
  cname: "",
  currentTags: [],
  initalTags: [],
});
function updateCargoTags() {
  const { currentTags, initalTags, cid } = tagManageForm;
  const diff_add = currentTags.filter((ctid: number) => {
    return !initalTags.includes(ctid);
  });
  const temp = currentTags.filter((ctid: number) => {
    return !diff_add.includes(ctid);
  });
  const diff_del = initalTags.filter((ctid: number) => {
    return !temp.includes(ctid);
  });
  if (diff_add.length > 0 || diff_del.length > 0) {
    baseAxios
      .post("/pmc/updateCargoTypes", { cid, del: diff_del, add: diff_add })
      .then((res) => {
        message.success(res.data.message);
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        loadMaterialList();
        tagManageModal.value = false;
      });
  } else {
    tagManageModal.value = false;
  }
}
const distributeModal = ref<boolean>(false);
function initDistributeData() {}
function initTagManageForm() {
  Object.keys(tagManageForm).map((key: string) => {
    if (typeof tagManageForm[key] === "string") {
      tagManageForm[key] = "";
    } else {
      tagManageForm[key] = [];
    }
  });
}
const tableData = ref<Array<IPmcTableData>>([]);
</script>
<template>
  <n-grid :cols="1">
    <n-gi>
      <n-card title="物料信息">
        <n-space>
          <n-input v-model:value="tableQuery.keyWord" placeholder="关键字" />
          <n-button
            type="primary"
            secondary
            @click="
              () => {
                pagination.page = 1;
                loadMaterialList();
              }
            "
          >
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
          <n-button @click="addMaterialModal = false">取消</n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
  <n-modal v-model:show="tagManageModal" @after-leave="initTagManageForm">
    <n-card style="width: 30vw" title="物料标签管理">
      <n-descriptions :columns="1" label-placement="left">
        <n-descriptions-item label="物料编号">{{
          tagManageForm.cid
        }}</n-descriptions-item>
        <n-descriptions-item label="物料名称">{{
          tagManageForm.cname
        }}</n-descriptions-item>
      </n-descriptions>
      <n-divider />
      <n-form-item label="物料标签">
        <n-select
          multiple
          v-model:value="tagManageForm.currentTags"
          label-field="typeName"
          value-field="ctid"
          placeholder="请选择物料标签"
          :options="formOptions"
        ></n-select>
      </n-form-item>
      <n-space justify="end">
        <n-button type="primary" @click="updateCargoTags">确定</n-button>
        <n-button @click="tagManageModal = false">取消</n-button>
      </n-space>
    </n-card>
  </n-modal>
  <n-modal
    v-model:show="distributeModal"
    @after-leave="initDistributeData"
    @after-enter="loadDistributeData(currentRow as IPmcTableData)"
  >
    <n-card
      style="width: 40vw"
      title="物料分布"
      content-style="display: flex;justify-content: center;"
    >
      <div style="width: 80%; height: 500px" ref="distributeChartRef"></div>
    </n-card>
  </n-modal>
</template>
<style lang="scss" scoped>
.n-card {
  border-radius: 15px;
}
</style>
