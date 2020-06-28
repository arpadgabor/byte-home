<script>
import { setAuthHeader } from '@/utils/helpers'
export default {
  data() {
    return {
      sensorValue: NaN,
      trend: 0,
      lastRecording: undefined,
      flashing: false,
      error: null
    }
  },
  props: ['sensor'],
  mounted() {
    this.listen()
    this.getLastStatus()
  },
  methods: {
    listen() {
      let here = this
      this.$socket.$subscribe(this.sensor.id, (data) => {
        here.flashing = true
        here.setTrend(here.sensorValue, data.value)

        here.lastRecording = new Date(data.datetime).toLocaleString()
        here.sensorValue = data.value
      })
    },

    setTrend(oldValue, currentValue) {
      if(oldValue.toFixed(1) < currentValue.toFixed(1)) { this.trend = 1 }
      if(oldValue.toFixed(1) === currentValue.toFixed(1)) { this.trend = 0 }
      if(oldValue.toFixed(1) > currentValue.toFixed(1)) { this.trend = -1 }
    },

    async getLastStatus() {
      try {
        let response = await this.$http.$get(`api/sensors/state/${this.sensor.id}`, setAuthHeader(this.$store.state.auth.token))

        this.sensorValue = response.value
        this.lastRecording = new Date(response.time).toLocaleString()
      } catch(err) {
        this.sensorValue = NaN
      }
    },
  }
}
</script>

<template>
  <div class="flex flex-row items-center h-full justify-between">
    <div class="h-full">
      <h4 class="text-base m-0 leading-none text-gray-600">{{ sensor.type }}</h4>
      <h1
        class="text-4xl m-0 leading-none font-bold text-primary-600"
        :class="{ 'text-glow': flashing }"
        @animationend="flashing = false"
        :title="`Last recorded: ${lastRecording}`"
      >
        {{ sensorValue }}<sup class="text-base">{{sensor.unit}}</sup>
      </h1>
    </div>
    <div class="h-full px-3">
      <span>
        <i v-if="trend === 1" class="gg-trending text-green-600"></i>
        <i v-else-if="trend === -1" class="gg-trending-down text-red-600"></i>
        <i v-else class="gg-math-equal text-gray-700"></i>
      </span>
    </div>
  </div>
</template>

<style>

</style>
