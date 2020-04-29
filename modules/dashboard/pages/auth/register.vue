<template>
  <main
    class="container min-h-screen flex flex-col items-center justify-center"
  >
    <h1 class="title text-center text-primary-600 leading-none mb-4">
      Create your new account
    </h1>
    <p class="mb-8">
      Or
      <nuxt-link :to="'/auth'" class="underline text-primary-600"
        >sign in to an existing one</nuxt-link
      >!
    </p>
    <register-form />
    <nuxt-link :to="'/auth/forgot'" class="mt-4 text-gray-600 underline">
      I forgot my password
    </nuxt-link>
  </main>
</template>

<script>
import registerForm from '@/components/auth/register-form'

export default {
  head() {
    return{
      title: 'Create a new account'
    }
  },
  components: {
    registerForm
  },
  layout: 'auth'
}
</script>

<style></style>
