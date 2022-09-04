import * as echarts from "echarts";
import { IOdata, IRoseDiagramData } from "../interface/dataModel";
function drawIOBar(el: HTMLElement, data: Array<IOdata>) {
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
        label:{
          show:true,
        }
      },
      {
        name: "出库",
        type: "bar",
        data: outData,
        label:{
          show:true,
        }
      },
    ],
  });
}
function drawRoseDiagram(el: HTMLElement, data: Array<IRoseDiagramData>) {
  const canvas = echarts.init(el);
  canvas.setOption({
    series: {
      type: "pie",
      roseType: "area",
      data: data,
    },
  });
}

export { drawIOBar, drawRoseDiagram };
