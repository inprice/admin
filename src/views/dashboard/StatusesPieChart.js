import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["series"],
  mounted() {
    this.renderChart(
      {
        labels: [
          "AVAILABLE",
          "NOT AVAILABLE",
          "TOBE IMPLEMENTED",
          "NETWORK ERROR",
          "OTHERS",
        ],
        datasets: [
          {
            backgroundColor: [
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
              'rgb(153, 102, 255)',
            ],
            data: this.series,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: "bottom",
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        plugins: {
          datalabels: {
            color: 'black',
            textAlign: 'center',
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data) => {
                sum += data;
              });
              let percentage = '';
              if (value) {
                percentage = ((value * 100) / sum).toFixed(0) + "%";
              }
              return percentage;
            },
          },
        },
      }
    );
  },
};
