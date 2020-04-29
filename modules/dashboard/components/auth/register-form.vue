<template>
  <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 bg-white shadow-lg p-6 rounded-lg">
    <form @submit.prevent>
      <div class="flex flex-row space-x-2">
        <x-input
          v-model="firstName"
          :label="'Given Name'"
          :name="'firstName'"
          :placeholder="'John'"
          :type="'firstName'"
          required
          class="mb-2"
        />
        <x-input
          v-model="lastName"
          :label="'Last Name'"
          :name="'lastName'"
          :placeholder="'Smith'"
          :type="'lastName'"
          required
          class="mb-2"
        />
      </div>
      <x-input
        v-model="email"
        :type="'email'"
        :label="'Email'"
        :name="'email'"
        :placeholder="'john.doe@mail.com'"
        required
        class="mb-2"
      />
      <x-input
        v-model="password"
        :label="'Password'"
        :name="'password'"
        :placeholder="'********'"
        :type="'password'"
        required
        class="mb-4"
      />
      <x-button
        :variant="'primary'"
      >Create account!</x-button>
    </form>
  </div>
</template>

<script>
import xButton from '@/components/common/forms/button'
import xInput from '@/components/common/forms/input'

export default {
  components: {
    xButton,
    xInput
  },
  data() {
    return {
      email: null,
      firstName: null,
      lastName: null,
      password: null
    }
  }
}
</script>

<style></style>
