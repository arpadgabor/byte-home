<script>
import xInput from '@/components/common/forms/input'
import xButton from '@/components/common/forms/button'
import { setAuthHeader } from '@/utils/helpers'

export default {
  components: {
    xInput,
    xButton
  },
  props: ['sensor'],
  data() {
    return {
      name: undefined
    }
  },
  mounted() {
    this.name = this.sensor.name || null
  },
  methods: {
    async updateSensor() {
      try {
        let response = await this.$http.$put(`api/sensors/${this.sensor.id}`,
          { name: this.name },
          setAuthHeader(this.$store.state.auth.token)
        )
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<template>
  <div class="flex flex-col">
    <small>Type</small>
    <h1 class="h1">
      {{ sensor.type }}
    </h1>
    <p>Unit of measurement: <strong>{{ sensor.unit }}</strong></p>
    <hr class="my-8">
    <form @submit.prevent="updateSensor" class="flex flex-col">
      <x-input
        id="sensorName"
        v-model="name"
        label="Sensor name"
        name="sensorName"
        required
        placeholder="Type in a nice name"
      ></x-input>
      <x-button class="mt-2" type="submit">Update name</x-button>
    </form>
  </div>
</template>

<style>

</style>
