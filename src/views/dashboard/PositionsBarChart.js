import { Bar } from 'vue-chartjs'
import SystemConsts from '@/data/system';

export default {
  extends: Bar,
  props: ['series'],
  mounted () {
    this.renderChart({
      labels: SystemConsts.POSITION_NAMES,
      datasets: [
        {
          backgroundColor: [
            'rgba(75, 192, 192, 0.3)',
            'rgba(255, 205, 86, 0.3)',
            'rgba(153, 102, 255, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(255, 99, 132, 0.3)',
          ],
          borderWidth:1.5,
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