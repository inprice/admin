import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ['series'],
  mounted() {
    this.renderChart(
      {
        labels: ['ACTIVES','WAITINGS','TRYINGS','PROBLEMS'],
        datasets: [
          {
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 99, 132, 0.5)',
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
            font: {
              weight: "500",
            },
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
