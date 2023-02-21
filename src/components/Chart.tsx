import { useContext, useEffect, useState } from "react";
import * as echarts from "echarts";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ColorThemeContext } from "../providers/ThemeProvider";

interface TabState {
  chartData: any;
}

export default function Chart(data: TabState): JSX.Element {
  const { chartData } = data;
  const colors = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {
      // 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
      // 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
      offset: 0.6,
      color: "#86cbbe",
    },
    {
      offset: 1,
      color: "#e0f1ee",
    },
  ]);
  const activeColors = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: "#049278",
    },
    {
      offset: 1,
      color: "#d7ede9",
    },
  ]);

  useEffect(() => {
    const list = [
      200, 52, 200, 334, 390, 330, 200, 52, 200, 334, 390, 330, 200, 52, 200,
      334, 390, 330, 200, 52, 200, 334, 390, 330, 334, 390, 330, 200, 52, 200,
      334, 390, 330, 200, 334, 390, 330, 200, 52, 200, 334, 390, 330, 200, 600,
      230, 400, 450, 140, 500,
    ];
    const xData = [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
      "01:30",
      "02:30",
      "03:30",
      "04:30",
      "05:30",
      "06:30",
      "07:30",
      "08:30",
      "09:30",
      "10:30",
      "11:30",
      "12:30",
      "13:30",
      "14:30",
      "15:30",
      "16:30",
      "17:30",
      "18:30",
      "19:30",
      "20:30",
      "21:30",
      "22:30",
      "23:30",
      "23:10",
      "20:10",
    ];
    const yDate = list?.map((item) => {
      return {
        value: item,
        itemStyle: {
          normal: {
            color: colors,
          },
          emphasis: {
            /// /鼠标悬停时：
            color: activeColors,
          },
        },
      };
    });
    renderChart(xData, yDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  const renderChart = (xData, yDate) => {
    const chartDom = document.getElementById("chartRoot");
    if (!chartDom) {
      return;
    }
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#F5F8FC",
        borderWidth: "0",
        axisPointer: {
          type: "line",
        },
        formatter: (idata) => {
          const dataSingle = idata[0];
          const xKey = `Timestamp:</br><span style="color:#000000;font-weight:600;">${dataSingle.axisValue}</span></br>`;
          const yKey = `${dataSingle.seriesName}</br><span style="color:#000000;font-weight:600;">${dataSingle.data.value}</span></br>`;
          const str = xKey + yKey;
          return str;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: xData,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#aaa",
            },
            formatter(value) {
              // 在此处自定义x轴显示
              return value;
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            // 网格线
            show: true,
            lineStyle: {
              color: ["#ddd"],
              type: "dashed",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#aaa",
            },
            formatter(value) {
              return value + " min";
            },
          },
        },
      ],
      series: [
        {
          name: "Proof Generation Time:",
          type: "bar",
          barWidth: "70%",
          data: yDate,
        },
      ],
    };

    myChart.setOption(option);
  };
  return <div className="chartRoot" id="chartRoot" />;
}
