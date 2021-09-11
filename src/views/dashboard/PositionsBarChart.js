import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['series'],
  mounted() {
    this.renderChart({
      labels: ['LOWEST','HIGHEST','LOWER','AVERAGE','HIGHER','EQUAL','NA'],
      datasets: [
        {
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
          ],
          borderWidth:2,
          data: this.series
        }
      ]
    }, {
      responsive: true, 
      maintainAspectRatio: false,
      options: {
        legend: {
          display: false,
        },
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
    });
  }
}