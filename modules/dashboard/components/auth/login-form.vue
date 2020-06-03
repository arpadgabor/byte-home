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
      password: null,
      error: null,
      buttonText: 'Sign in!'
    }
  },
  methods: {
    async signIn() {
      this.buttonText = 'Loading...'
      const credentials = {
        email: this.email,
        password: this.password
      }

      try {
        const response = await this.$http.$post('api/auth/login', credentials)
        this.buttonText = 'Done!'
        this.$store.commit('auth/setToken', response.accessToken)
        await this.$store.dispatch('auth/getUser')
        this.$router.push('/')
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
  <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 bg-white shadow-lg p-6 rounded-lg">
    <div v-if="error" class="alert error mb-2">
      {{ error }}
    </div>
    <form @submit.prevent="signIn()">
      <x-input
        v-model="email"
        type="email"
        label="Email"
        name="email"
        placeholder="john.doe@mail.com"
        autocomplete="username"
        required
        autofocus
        class="mb-2"
      />
      <x-input
        v-model="password"
        label="Password"
        name="password"
        placeholder="********"
        type="password"
        autocomplete="password"
        required
        class="mb-4"
      />
      <x-button
        variant="primary"
        class="w-full"
      >{{ buttonText }}</x-button>
    </form>
  </div>
</template>

<style></style>
