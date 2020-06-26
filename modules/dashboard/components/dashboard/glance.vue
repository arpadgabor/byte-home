<script>
import glanceDoorSensor from '@/components/dashboard/devices/door-glance'
import glanceMeasurement from '@/components/dashboard/devices/current-measurements-glance'
import { listSensors } from '@/utils/helpers'

export default {
  components: {
    glanceDoorSensor,
    glanceMeasurement
  },
  computed: {
    door() { return listSensors(this.$store.state.auth.user).find(s => s.type === 'bool') },
    temp() { return listSensors(this.$store.state.auth.user).find(s => s.type === 'temperature') },
    humid() { return listSensors(this.$store.state.auth.user).find(s => s.type === 'humidity') }
  }
}
</script>

<template>
  <section id="at-a-glance" class="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
    <nuxt-link to="/households" id="nof-households" class="card default glance-item">
      <h4 class="text-base m-0 leading-none text-gray-600">Households</h4>
      <h1 class="text-4xl m-0 leading-none font-bold text-primary-600">{{ $store.state.auth.user.households.length }}</h1>
    </nuxt-link>
    <nuxt-link :to="`/sensors/${door.id}`" id="door" class="card default glance-item">
      <glance-door-sensor v-if="door" :sensor="door"></glance-door-sensor>
    </nuxt-link>
    <nuxt-link :to="`/sensors/${temp.id}`" id="temp" class="card default glance-item">
      <glance-measurement v-if="temp" :sensor="temp"></glance-measurement>
    </nuxt-link>
    <nuxt-link :to="`/sensors/${humid.id}`" id="humid" class="card default glance-item">
      <glance-measurement v-if="humid" :sensor="humid"></glance-measurement>
    </nuxt-link>
  </section>
</template>

<style scoped lang="postcss">
.glance-item {
  @apply flex flex-col border border-transparent transition-all duration-200;
}
.glance-item:hover {
  @apply border-primary-300;
}
.glance-item:focus {
  @apply shadow-outline outline-none;
}
</style>
