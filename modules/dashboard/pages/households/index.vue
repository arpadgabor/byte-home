<template>
  <main class="w-full -mt-16">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Households</h1>
      </template>
      <template v-slot:actions>
        <x-button :variant="'primary'" type="'button'">Add Household</x-button>
      </template>
    </dashboard-header>
  </main>
</template>

<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xButton from '@/components/common/forms/button'

export default {
  components: {
    dashboardHeader,
    xButton
  }
}
</script>

<style>

</style>
