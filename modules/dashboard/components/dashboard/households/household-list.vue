<script>
import householdListItem from './household-list-item'
export default {
  components: {
    householdListItem
  }
}
</script>

<template>
  <section
    id="households-list"
    class="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
  >
    <household-list-item
      v-for="household of $store.state.auth.user.households"
      :household="household"
      :key="household.id"
    ></household-list-item>
  </section>
</template>

<style lang="postcss" scoped></style>
