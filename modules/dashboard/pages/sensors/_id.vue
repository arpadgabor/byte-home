<template>
  <main class="w-full">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Sensor</h1>
      </template>
      <template v-slot:actions>
        <x-button variant="tertiary" type="'button'">Device panel</x-button>
      </template>
    </dashboard-header>
    <section v-if="sensor" class="grid grid-cols-6 col-gap-4">
      <live-chart class="col-span-4" :sensor="sensor">
      </live-chart>
      <div class="card default col-span-2">
        <edit-sensor :sensor="sensor"></edit-sensor>
      </div>
    </section>
  </main>
</template>

<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'
import liveChart from '@/components/dashboard/sensors/live-chart'
import editSensor from '@/components/dashboard/sensors/edit-sensor'

import { setAuthHeader } from '../../utils/helpers'

export default {
  components: {
    liveChart,
    dashboardHeader,
    xButton,
    editSensor
  },
  head() {
    return {
      title: 'Sensor'
    }
  },
  middleware: 'authenticated',
  data() {
    return {
      sensor: null
    }
  },
  async mounted() {
    await this.loadSensor()
  },
  methods: {
    async loadSensor() {
      try {
        let response = await this.$http.$get(`api/sensors/${this.$route.params.id}`, setAuthHeader(this.$store.state.auth.token))
        this.sensor = response
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>
