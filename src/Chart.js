import React from "react";
import { Line } from "react-chartjs-2";
import ChartJS from "chart.js";

ChartJS.defaults.global.defaultFontColor = "white";
function makeData(data) {
  data = data.map(d => {
    const a = new Date();
    const s = d[0].split(":");
    a.setHours(s[0], s[1], 0);
    return { x: a, y: d[1] };
  });
  return {
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        data
      }
    ]
  };
}

const options = {
  legend: {
    display: false
  },
  animation: {
    duration: 0 // general animation time
  },
  scales: {
    xAxes: [
      {
        type: "time",
        distribution: "series"
      }
    ]
  },
  elements: {
    line: {
      tension: 0 // disables bezier curves
    }
  }
};

function Chart(props) {
  return <Line data={makeData(props.data)} options={options} />;
}

export default Chart;
