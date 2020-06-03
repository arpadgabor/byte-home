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
      <div
        v-if="households"
        class="w-full"
      >
        <div
          v-for="house of households"
          :key="house.id"
          class="w-full"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            v-for="device of house.devices"
            :key="device.id"
          >
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

<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'
import sensor from '@/components/dashboard/sensor'
import glance from '@/components/dashboard/glance'

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
  },
  computed: {
    households() {
      return this.$store.state.auth.user.households
    }
  }
}
</script>

<style></style>
