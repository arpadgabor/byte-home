<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'
import sensor from '@/components/dashboard/sensor'
import glance from'@/components/dashboard/glance'

export default {
  head() {
    return {
      title: 'Dashboard'
    }
  },
  middleware: 'authenticated',
  components: {
    xButton,
    dashboardHeader,
    glance,
    sensor
  }
}
</script>

<template>
  <main class="w-full">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Dashboard</h1>
      </template>
      <template v-slot:actions>
        <x-button :variant="'secondary'" type="'button'">Layout</x-button>
      </template>
    </dashboard-header>
    <section>
      <glance />
    </section>
  </main>
  <!--
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
   -->
</template>

<style>
</style>
