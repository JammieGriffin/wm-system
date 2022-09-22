<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { NavigateNextOutlined as next } from "@vicons/material";
import { IOdata, IOLogData, IBaseChartData } from "../../interface/dataModel";
import { drawIOBar, drawRoseDiagram } from "../../tools/drawCanvas";
import { baseAxios } from "../../const";

const statisticData = reactive({
  warehouses: 10,
  putIn: 100,
  out: 88,
  people: 30,
});
const ioChartRef = ref();
const KWordsChartRef = ref();
const ioData: Array<IOdata> = [
  {
    date: "8-29",
    in: 10,
    out: 20,
  },
  {
    date: "8-30",
    in: 15,
    out: 30,
  },
  {
    date: "8-31",
    in: 10,
    out: 20,
  },
  {
    date: "9-1",
    in: 37,
    out: 25,
  },
  {
    date: "9-2",
    in: 52,
    out: 31,
  },
  {
    date: "9-3",
    in: 10,
    out: 33,
  },
  {
    date: "9-4",
    in: 19,
    out: 9,
  },
];
const ioLogData: Array<IOLogData> = [
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
  {
    host: "1号仓库",
    name: "零件T-1330",
    status: "入库",
    time: "2022.9.04",
    principal: "张三",
  },
];
const warehouseData: Array<IBaseChartData> = [
  {
    name: "东区1号仓库",
    value: 4300,
  },
  {
    name: "东区2号仓库",
    value: 1800,
  },
  {
    name: "东区3号仓库",
    value: 1960,
  },
  {
    name: "西区1号仓库",
    value: 2500,
  },
  {
    name: "西区2号仓库",
    value: 3100,
  },
];
onMounted(async () => {
  baseAxios.get("/ctrl/queryOverviewData").then((res) => {});
  await drawIOBar(ioChartRef.value, ioData);
  await drawRoseDiagram(KWordsChartRef.value, warehouseData);
});
</script>
<template>
  <n-grid :cols="4" x-gap="20" y-gap="20">
    <n-gi>
      <n-card hoverable embedded>
        <n-statistic tabular-nums label="当前厂区有">
          <n-number-animation
            :from="0"
            :to="statisticData.warehouses"
          ></n-number-animation>
          <template #suffix>间库房正在运行</template>
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card hoverable embedded>
        <n-statistic tabular-nums label="今日有">
          <n-number-animation
            :from="0"
            :to="statisticData.putIn"
          ></n-number-animation>
          <template #suffix>批货物入库</template>
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card hoverable embedded>
        <n-statistic tabular-nums label="今日有">
          <n-number-animation
            :from="0"
            :to="statisticData.out"
          ></n-number-animation>
          <template #suffix>批货物出库</template>
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card hoverable embedded>
        <n-statistic tabular-nums label="当前厂区内有">
          <n-number-animation
            :from="0"
            :to="statisticData.people"
          ></n-number-animation>
          <template #suffix>名仓库员工</template>
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card
        title="近七日出入库数据"
        embedded
        content-style="display: flex;justify-content: center;"
      >
        <div ref="ioChartRef" style="width: 80%; height: 300px"></div>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card
        title="库房货物存储量"
        embedded
        content-style="display: flex;justify-content: center;"
      >
        <div ref="KWordsChartRef" style="width: 80%; height: 300px"></div>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card title="1号仓库物料总览" embedded>
        <template #header-extra>
          <n-button type="primary" text
            >下一个
            <n-icon>
              <next />
            </n-icon>
          </n-button>
        </template>
        <div style="width: 80%; height: 300px"></div>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card title="最近10条进出库记录" embedded>
        <n-scrollbar style="max-height: 300px">
          <n-table>
            <thead>
              <tr>
                <th>仓库</th>
                <th>货物名称</th>
                <th>状态</th>
                <th>时间</th>
                <th>经手员工</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ioLogData" :key="index">
                <td>{{ item.host }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.principal }}</td>
                <td>
                  <n-button text type="info">查看详情</n-button>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
      </n-card>
    </n-gi>
  </n-grid>
</template>
<style lang="scss" scoped>
.n-card {
  border-radius: 15px;
}
</style>
