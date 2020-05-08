<script>
export default {
  props: {
    series: {
      type: Array,
      required: true
    },
  },
  data: function() {
    return {
      options: {
        grid: {
          show: true,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: true,
          }
        },
        stroke: {
          curve: 'straight',
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          toolbar: {
            show: false,
          },
          id: 'Timeseries',
        }
      }
    }
  }
}
</script>

<template>
  <VueApexCharts
    max-width="300"
    type="line"
    class="p-0"
    :options="options"
    :series="series"
  ></VueApexCharts>
</template>

<style>

</style>
