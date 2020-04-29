<script>
import dashboardHeader from '@/components/common/dashboard-header'
import xbutton from '@/components/common/forms/button'

export default {
  head() {
    return {
      title: 'Dashboard'
    }
  },
  middleware: 'authenticated',
  components: {
    dashboardHeader,
    xbutton
  }
}
</script>

<template>
  <main class="w-full -mt-16">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Dashboard</h1>
      </template>
      <template v-slot:actions>
        <xbutton :variant="'primary'" type="'button'">Add Household</xbutton>
      </template>
    </dashboard-header>
    <section class="container -mt-12">
      <div class="w-full bg-white rounded shadow-lg p-4">
        Hello
      </div>
    </section>
  </main>
</template>

<style>
</style>
