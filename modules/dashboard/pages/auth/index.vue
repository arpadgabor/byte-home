<template>
  <main class="container min-h-screen flex flex-col items-center justify-center">
    <h1 class="title text-center text-primary-600 leading-none mb-4">Sign in to your account</h1>
    <p class="mb-8">
      Or
      <nuxt-link
        :to="'/auth/register'"
        class="underline text-primary-600"
      >create a new one</nuxt-link>!
    </p>
    <login-form />
    <nuxt-link
      :to="'/auth/forgot'"
      class="mt-4 text-gray-600 underline"
    >I forgot my password</nuxt-link>
  </main>
</template>

<script>
import loginForm from '@/components/auth/login-form'

export default {
  head() {
    return{
      title: 'Sign in'
    }
  },
  components: {
    loginForm
  },
  layout: 'auth'
}
</script>

<style>

</style>
