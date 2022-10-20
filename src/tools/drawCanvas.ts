import * as echarts from "echarts";
import { IBaseChartData, IOdata } from "../interface/dataModel";
async function drawIOBar(el: HTMLElement, data: Array<IOdata>) {
  echarts.dispose(echarts.init(el));
  const canvas = echarts.init(el);
  const xData: Array<string> = data.map((item) => {
    return item.date;
  });
  const inData: Array<number> = data.map((item) => {
    return item.in;
  });
  const outData: Array<number> = data.map((item) => {
    return item.out;
  });
  canvas.setOption({
    legend: {
      orient: "horizontal",
      top: 10,
      data: ["入库", "出库"],
    },
    xAxis: {
      data: xData,
    },
    yAxis: {},
    series: [
      {
        name: "入库",
        type: "bar",
        data: inData,
        label: {
          show: true,
        },
      },
      {
        name: "出库",
        type: "bar",
        data: outData,
        label: {
          show: true,
        },
      },
    ],
  });
}
async function drawRoseDiagram(el: HTMLElement, data: Array<IBaseChartData>) {
  echarts.dispose(echarts.init(el));
  const canvas = echarts.init(el);
  canvas.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{b}:{c}单位",
    },
    series: {
      type: "pie",
      roseType: "radius",
      radius: [20, 100],
      data: data,
    },
  });
}

async function drawCapacityUsage(el: HTMLElement, data: Array<IBaseChartData>) {
  echarts.dispose(echarts.init(el));
  const canvas = echarts.init(el);
  canvas.setOption({
    series: [
      {
        type: "pie",
        data: data,
        radius: ["30%", "70%"],
        label: {
          show: true,
          formatter: "{b}\n{c}单位",
        },
        labelLine: { show: true },
      },
    ],
  });
}
async function drawDistributionPie(el: HTMLElement, data: Array<IBaseChartData>){
  echarts.dispose(echarts.init(el));
  const canvas = echarts.init(el);
  canvas.setOption({
    tooltip:{
      trigger:"item"
    },
    legend:{
      orient:'vertical',
      left:'left'
    },
    series:[
      {
        type:'pie',
        radius:'50%',
        data:data,
      }
    ]
  })
}
export { drawIOBar, drawRoseDiagram, drawCapacityUsage, drawDistributionPie };
