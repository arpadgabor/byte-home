<template>
  <main class="w-full">
    <dashboard-header>
      <template v-slot:title>
        <h1 class="h1">Households</h1>
      </template>
      <template v-slot:actions>
        <x-button :variant="'primary'" type="'button'">Add Household</x-button>
      </template>
    </dashboard-header>
    <section>
      <household-list></household-list>
    </section>
  </main>
</template>

<script>
import dashboardHeader from '@/components/common/dashboard-header'
import householdList from '@/components/dashboard/households/household-list'
import xButton from '@/components/common/forms/button'

export default {
  components: {
    dashboardHeader,
    householdList,
    xButton
  }
}
</script>

<style lang="postcss" scoped>

</style>
