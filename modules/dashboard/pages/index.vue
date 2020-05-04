<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'
import chartTimeseries from '@/components/dashboard/charts/timeseries'
import sensor from '@/components/dashboard/sensor'

export default {
  head() {
    return {
      title: 'Dashboard'
    }
  },
  middleware: 'authenticated',
  components: {
    dashboardHeader,
    xButton,
    chartTimeseries,
    sensor
  }
}
</script>

<template>
  <main class="w-full -mt-16">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Dashboard</h1>
      </template>
      <template v-slot:actions>
        <x-button :variant="'primary'" type="'button'">Add Household</x-button>
      </template>
    </dashboard-header>
    <section class="container -mt-12">
      <div class="w-full bg-white rounded shadow-lg p-4" v-if="$store.state.user">
        <div v-for="household of $store.state.user.households" :key="household.id">
          <div v-for="device of household.devices" :key="device.id" class="grid grid-cols-2 col-gap-4">
            <sensor
              class="col-span-1"
              v-for="sensor of device.sensors"
              :key="sensor.id"
              :id="sensor.id"
              :name="sensor.name"
              :type="sensor.type"
              :unit="sensor.unit"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
</style>
