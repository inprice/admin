import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["labels", "minData", "avgData", "maxData"],
  mounted() {
    this.renderChart(
      {
        height: 100,
        labels: this.labels,
        datasets: [
          { label: "Min", backgroundColor: "green", data: this.minData },
          { label: "Avg", backgroundColor: "blue", data: this.avgData },
          { label: "Max", backgroundColor: "red", data: this.maxData },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        options: {
          legend: {
            display: false,
          },
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }
    );
  },
};
