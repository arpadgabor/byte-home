<script>
import { parseISO, subHours, subDays, format } from 'date-fns'

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
      series: null
    }
  },
  async mounted() {
    const timeseries = await this.fetchTimeseries()

    this.series = [{
      name: this.type,
      data: this.parseSeries(timeseries)
    }]
  },
  methods: {
    async fetchTimeseries() {
      const timeNow = new Date()
      const before = subHours(timeNow, 24)
      const url = api.private.getSensorsTimeseries(this.id, timeNow.toISOString(), before.toISOString(), 'hour')

      try {
        return await this.$http.$get(url, setAuthHeader(this.$store.state.token))
      } catch(e) {
        console.log(e)
      }
    },
    /**
     * @param {Array} series
    */
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
