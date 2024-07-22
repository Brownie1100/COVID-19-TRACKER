import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { parse, format } from 'date-fns';

// Register the necessary components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return numeral(context.raw).format("+0.0");
        },
      },
    },
  },
  maintainAspectRatio: true,
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        format: "MM/YY",
        tooltipFormat: 'll',
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        callback: function (value) {
          return numeral(value).format("0a");
        },
      },      
    },
  },
};

function LineGraph({casestypes, country}) {
  console.log("sadhd"+casestypes+" "+country);
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    console.log('casestypes:' + casestypes); // Log the casestypes prop value
    const fetchData = async () => {
      const url = country === "ww" ? "https://disease.sh/v3/covid-19/historical/all?lastdays=180" : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=180`;
      const response = await fetch(
        url
      );
      const data = await response.json();
      const processedData = processChartData(data,casestypes);
      setChartData({
        datasets: [
          {
            label: 'Cases Over Time',
            data: processedData,
            borderColor: 'rgba(75,192,192,1)',
            fill: true,
          },
        ],
      });
    };
    fetchData();
  }, [casestypes]);

  const processChartData = (data, types) => {
    types = types || 'cases';
    const dataToChart = [];
    let points;

    for (let date in data[types]) {
      const parsedDate = parse(date, 'M/d/yy', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');

      if (points) {
        const newPoint = {
          x: formattedDate,
          y: data[types][date] - points,
        };
        dataToChart.push(newPoint);
      }
      points = data[types][date];
    }
    return dataToChart;
  };

  return (
    <div>
      <h1>Graph</h1>
      {chartData?.datasets?.length > 0 && (
        <Line options={options} data={chartData} />
      )}
    </div>
  );
}

export default LineGraph;
