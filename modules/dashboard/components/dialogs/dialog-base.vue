<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['modal'])
  }
}
</script>

<template>
  <div
    v-if="modal"
    class="absolute h-screen w-screen left-0 top-0 bg-gray-900 bg-opacity-50"
  >
    <component :is="modal" />
  </div>
</template>

<style></style>
