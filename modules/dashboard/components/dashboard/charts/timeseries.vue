<script>
export default {
  props: {
    series: {
      type: Array,
      required: true
    },
    unit: {
      type: String,
      default: ''
    }
  },
  computed: {
    options() {
      return {
        noData: {
          text: 'Nothing to show (yet?).'
        },
        grid: {
          show: true,
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: true,
            datetimeFormatter: {
              year: 'yyyy',
              month: "MMM 'yy",
              day: 'dd MMM, HH:mm',
              hour: 'HH:mm',
            },
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: true,
            formatter: (value) => {
              return value.toFixed(1) + this.unit;
            }
          }
        },
        stroke: {
          curve: 'straight',
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        chart: {
          toolbar: {
            show: true,
          },
        }
      }
    }
  }
}
</script>

<template>
  <VueApexCharts
    :max-width="300"
    type="line"
    class="p-0"
    :options="options"
    :series="series"
  ></VueApexCharts>
</template>

<style>

</style>
