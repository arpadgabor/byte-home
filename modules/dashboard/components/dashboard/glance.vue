<script>
export default {
  asyncData() {
    return {

    }
  }
}
</script>

<template>
  <section id="at-a-glance" class="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
    <nuxt-link to="/households" id="nof-households" class="card default glance-item">
      <h4 class="text-base m-0 leading-none text-gray-600">Households</h4>
      <h1 class="text-4xl m-0 leading-none font-bold text-primary-600">{{ $store.state.auth.user.households.length }}</h1>
    </nuxt-link>
    <div id="nof-households" class="card default glance-item">

    </div>
    <div id="nof-households" class="card default glance-item">

    </div>
    <div id="nof-households" class="card default glance-item">

    </div>
  </section>
</template>

<style scoped lang="postcss">
.glance-item {
  @apply flex flex-col border border-transparent transition-all duration-200;
}
.glance-item:hover {
  @apply border-primary-300;
}
.glance-item:focus {
  @apply shadow-outline outline-none;
}
</style>
