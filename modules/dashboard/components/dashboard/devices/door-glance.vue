<script>
import { setAuthHeader } from '@/utils/helpers'
export default {
  data() {
    return {
      sensorStatus: undefined,
      lastRecording: undefined,
      error: null,
      flashing: false
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
        here.sensorStatus = data.value
        here.lastRecording = new Date(data.datetime).toLocaleString()
        here.flashing = true
      })
    },
    async getLastStatus() {
      try {
        let response = await this.$http.$get(`api/sensors/state/${this.sensor.id}`, setAuthHeader(this.$store.state.auth.token))
        this.sensorStatus = response.value
        this.lastRecording = new Date(response.time).toLocaleString()
      } catch(err) {
        this.sensorStatus = 0
      }
    }
  }
}
</script>

<template>
  <div class="flex flex-row items-center h-full">
    <div class="flex h-full px-3">
      <img v-if="sensorStatus" class="" src="/icons/door-closed.svg" alt="door open">
      <img v-else class="h-full" src="/icons/door-open.svg" alt="door closed">
    </div>
    <div class="h-full ml-3">
      <h4 class="text-base m-0 leading-none text-gray-600">Door</h4>
      <h1
        class="text-4xl m-0 leading-none font-bold text-primary-600"
        :class="{ 'text-glow': flashing }"
        @animationend="flashing = false"
        :title="`Last recorded: ${lastRecording}`"
      >{{ sensorStatus ? 'Closed' : 'Open' }}</h1>
    </div>
  </div>
</template>

<style>

</style>
