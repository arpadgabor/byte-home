<template>
  <main class="w-full">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Profile</h1>
      </template>
      <template v-slot:actions>
        <x-button variant="tertiary" type="'button'">Log out</x-button>
      </template>
    </dashboard-header>
  </main>
</template>

<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'

export default {
  head() {
    return {
      title: 'Profile'
    }
  },
  middleware: 'authenticated',
  components: {
    dashboardHeader,
    xButton
  }
}
</script>

<style>

</style>
