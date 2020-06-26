<script>
import chartTimeseries from '@/components/dashboard/charts/timeseries'
import xButton from '@/components/common/forms/button'
import { api } from '@/utils/constants'
import { setAuthHeader } from '@/utils/helpers'

export default {
  components: {
    chartTimeseries,
    xButton
  },
  props: ['sensor'],
  data() {
    return {
      series: [],
      measurements: [],
      error: undefined
    }
  },
  async mounted() {
    this.initSeries()
    this.listen()
  },
  methods: {
    initSeries() {
      this.series = [{
        slug: 'live',
        name: this.sensor.name || this.sensor.type,
        data: []
      }]
      this.tmpSeries = this.series
    },
    listen() {
      let self = this
      this.$socket.$subscribe(this.sensor.id, (data) => {
        self.measurements.push({ x: new Date(data.datetime), y: data.value })

        // max data points = 60
        if(self.measurements > 60)  {
          self.measurements.shift()
        }

        self.series = [{
          name: this.sensor.name || this.sensor.type,
          data: self.measurements
        }]
      })
    }
  }
}
</script>

<template>
  <client-only>
    <div class="card default flex-col">
      <div class="w-full flex flex-row justify-between">
        <div>
          <small class="text-gray-500 uppercase">{{ sensor.type }}</small>
          <h3 class="h3" contenteditable>Realtime</h3>
        </div>
      </div>
      <chart-timeseries
        v-if="series && !error"
        :series="series"
        :unit="sensor.unit"
      />
      <div class="alert error" v-if="error">
        {{ error }}
      </div>
    </div>
  </client-only>
</template>
