<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { NavigateNextOutlined as next } from "@vicons/material";
import { IOdata, IOLogData, IBaseChartData } from "../../interface/dataModel";
import {
  drawCapacityUsage,
  drawIOBar,
  drawRoseDiagram,
} from "../../tools/drawCanvas";
import { baseAxios } from "../../const";
import { useMessage } from "naive-ui";
import { ILatestTrading, ILatestTradingRecord } from "../../api/data";
const message = useMessage();
const statisticData = reactive({
  warehouses: 0,
  putIn: 0,
  out: 0,
  people: 0,
});
const ioChartRef = ref();
const KWordsChartRef = ref();
const ioData: Array<IOdata> = [];
const ioLogData= ref<Array<IOLogData>>([]);
const warehouseData: Array<IBaseChartData> = [];
const warehouseList = ref<
  Array<{ hid: string; houseName: string; capacity: number }>
>([]);

function loadOverviewData() {
  baseAxios
    .get("/ctrl/queryOverviewData")
    .then((res) => {
      const { staffs, warehouses, trading } = res.data.result;
      trading.forEach((item: { total: number; isPop: number }) => {
        item.isPop === 1
          ? (statisticData.out = item.total)
          : (statisticData.putIn = item.total);
      });
      statisticData.people = staffs;
      statisticData.warehouses = warehouses;
    })
    .catch((err) => {
      message.error(err);
    });
}
async function loadLatestTrading() {
  await baseAxios.get("/ctrl/getLatestTrading").then((res) => {
    const data = res.data.result;
    Array.from(
      new Set(
        data.map((item: ILatestTrading) => {
          return item.date;
        })
      )
    ).forEach((date) => {
      const ioDataItem = {
        date: date as string,
        in: 0,
        out: 0,
      };
      data.forEach((item: ILatestTrading) => {
        if (item.date === date) {
          item.isPop === 1
            ? (ioDataItem.out += item.count)
            : (ioDataItem.in += item.count);
        }
      });
      ioData.push(ioDataItem);
    });
  });
}
async function loadCapacityUsage() {
  await baseAxios.get("/ctrl/getCapacityUsage").then((res) => {
    res.data.result.forEach((item: { total: number; houseName: string }) => {
      const { total, houseName } = item;
      warehouseData.push({ name: houseName, value: total });
    });
  });
}
async function loadWarehouseList() {
  await baseAxios.get("/ctrl/getWarehouseList").then((res) => {
    warehouseList.value = res.data.result;
  });
}
const usageData = ref<Array<IBaseChartData>>([]);
const houseIndex = ref<number>(0);
const currentTitle = ref<string>("");
const usageChartRef = ref();
async function loadUsageData(index: number) {
  const { hid, houseName } = warehouseList?.value[index];
  currentTitle.value = `${houseName}容量使用情况`;
  await baseAxios
    .get("/warehouse/detial/getStoreInfo", { params: { hid } })
    .then((res) => {
      usageData.value = [];
      let usageCapacity = 0;
      res.data.result.forEach((data: { cname: string; count: number }) => {
        const { cname, count } = data;
        usageData.value.push({
          name: cname,
          value: count,
        });
        usageCapacity += count;
      }, usageCapacity);
      usageData.value.push({
        name: "未使用",
        value: warehouseList.value[index].capacity - usageCapacity,
      });
    });
}
async function clearCanvas() {
  usageChartRef.value.innerHTML = null;
}
async function nextChart() {
  houseIndex.value = (houseIndex.value + 1) % warehouseList.value.length;
  await clearCanvas();
  await loadUsageData(houseIndex.value);
  await drawCapacityUsage(usageChartRef.value, usageData.value);
}
function loadTradingRecord() {
  baseAxios.get("/ctrl/getLatestRecord").then((res) => {
    res.data.result.forEach((record: ILatestTradingRecord) => {
      const { cname, count, houseName, isPop, usrName } = record;
      const time = new Date(record.time).toLocaleDateString();
      const status = isPop === 1 ? "出库" : "入库";
      ioLogData.value.push({
        host: houseName,
        name: cname,
        status,
        time,
        principal: usrName,
        count,
      });
    });
  });
}
onMounted(async () => {
  loadOverviewData();
  loadTradingRecord();
  await loadLatestTrading();
  await loadCapacityUsage();
  await drawIOBar(ioChartRef.value, ioData);
  await drawRoseDiagram(KWordsChartRef.value, warehouseData);
  await loadWarehouseList();
  await loadUsageData(0);
  await drawCapacityUsage(usageChartRef.value, usageData.value);
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
        title="仓库货物存储量"
        embedded
        content-style="display: flex;justify-content: center;"
      >
        <div ref="KWordsChartRef" style="width: 80%; height: 300px"></div>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card
        :title="currentTitle"
        embedded
        content-style="display: flex;justify-content: center;"
      >
        <template #header-extra>
          <n-button type="primary" text @click="nextChart"
            >下一个
            <n-icon>
              <next />
            </n-icon>
          </n-button>
        </template>
        <div style="width: 80%; height: 300px" ref="usageChartRef"></div>
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
                <th>货物数量</th>
                <th>状态</th>
                <th>时间</th>
                <th>经手员工</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ioLogData" :key="index">
                <td>{{ item.host }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.count }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.principal }}</td>
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
