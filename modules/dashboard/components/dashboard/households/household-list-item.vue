<script>
export default {
  props: {
    household: {
      type: Object,
      required: true
    }
  },
  computed: {
    image() {
      return this.household.image
        ? this.household.image.url
        : 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&h=900&q=80'
    }
  }
}
</script>

<template>
  <nuxt-link :to="household.id" append>
    <div class="card default relative h-64 overflow-hidden">
      <img
        class="absolute left-0 top-0 h-full w-full object-cover z-10"
        :src="image"
        :alt="household.name"
      >
      <div class="relative z-10 w-full h-full flex flex-col justify-end">
        <small class="uppercase text-white text-shadow">{{ household.address.street }}</small>
        <h3 class="text-xl font-bold text-white text-shadow">
          {{ household.name }}
        </h3>
      </div>
    </div>
  </nuxt-link>
</template>

<style lang="postcss" scoped>
.text-shadow {
  text-shadow: 0 4px 8px rgba(0,0,0,.4);
}
</style>
