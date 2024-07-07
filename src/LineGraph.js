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
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'year',
        tooltipFormat: 'yyyy',
      },
      // min: "2020-01-01",
      // max: "2023-12-31",
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
      max: 5000000,
      stepSize: 10000000,
    },
  },
};

function LineGraph({casestypes="cases"}) {
  const [chartData, setChartData] = useState({ datasets: [] });

  const processChartData = (data, types = 'cases') => {
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
    console.log("Processed Data: ", dataToChart); // Add this line to check processed data
    return dataToChart;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://disease.sh/v3/covid-19/historical/all?lastdays=all'
      );
      const data = await response.json();
      console.log("Fetched Data: ", data); // Add this line to check fetched data
      const processedData = processChartData(data);
      setChartData({
        datasets: [
          {
            label: 'Cases Over Time',
            data: processedData,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      });
    };
    fetchData();
  }, [casestypes]);

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
