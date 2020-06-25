<script>
import xButton from '~/components/common/forms/button'
import xInput from '~/components/common/forms/input'
import { setAuthHeader } from '@/utils/helpers'
export default {
  components: {
    xButton, xInput
  },
  data() {
    return {
      deviceMac: 'a4:cf:12:9a:d9:9c',
      household: '9792a345-8339-45c5-8bb7-b71de7db614f',
      buttonText: 'Add device!',
      error: null
    }
  },
  methods: {
    async addNewDevice() {
      this.buttonText = 'Loading...'

      try {
        const response = await this.$http.$put(
          `api/households/${this.household}/device`,
          { mac: this.deviceMac.split(':').join('') },
          setAuthHeader(this.$store.state.auth.token)
        )
        this.buttonText = 'Done!'
        this.$store.commit('modal/close')
      } catch(e) {
        this.buttonText = 'Try again'
        let err = await e.response.json()
        this.error = err.message
      }
    }
  }
}
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="addNewDevice">
      <x-input
        v-model="deviceMac"
        type="deviceMac"
        label="Insert MAC address"
        name="deviceMac"
        placeholder="aa:bb:cc:dd:ee:ff"
        required
        autofocus
        class="mb-2"
      ></x-input>
      <x-input
        v-model="household"
        type="household"
        label="Select household"
        name="household"
        placeholder="uuid"
        required
        autofocus
        class="mb-2"
      ></x-input>
      <x-button
        variant="primary"
        class="w-full"
      >Add device</x-button>
      <div v-if="error" class="alert error">
        <p>{{ error }}</p>
      </div>
    </form>
  </div>
</template>

<style>

</style>
