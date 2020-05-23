<script>
import { parseISO, subHours, subDays, subMinutes, format } from 'date-fns'

import chartTimeseries from '@/components/dashboard/charts/timeseries'
import { api } from '@/utils/constants'
import { setAuthHeader } from '@/utils/helpers'

export default {
  components: {
    chartTimeseries
  },
  props: {
    id: String | Number,
    name: String,
    type: String,
    unit: String,
  },
  data() {
    return {
      series: null,
      step: 'minute',
    }
  },
  async mounted() {
    const timeseries = await this.fetchTimeseries()
    console.log(timeseries)
    this.series = [{
      name: 'Average',
      data: this.parseSeries(timeseries)
    }]
  },
  methods: {
    async fetchTimeseries() {
      const timeNow = new Date()
      const before = subDays(timeNow, 1)

      const url = api.private.getSensorsTimeseries(
        this.id, timeNow.toISOString(), before.toISOString(), this.step
      )

      try {
        return await this.$http.$get(url, setAuthHeader(this.$store.state.token))
      } catch(e) {
        console.log(e)
      }
    },

    parseSeries(series) {
      return series.map((val) => {
        return {
          x: format(parseISO(val.datetime), 'MM/dd/yyyy HH:mm'),
          y: val.avg.toFixed(1)
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <h3 class="h3">{{ name || 'no name' }}</h3>
    {{ type }}
    <chart-timeseries
      v-if="series"
      :series="series"
    />
  </div>
</template>

<style>

</style>