<script>
import navigation from '@/components/common/navigation'

export default {
  components: {
    navigation
  },
  mounted() {
    this.$store.dispatch('startTimer')
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-gray-100">
    <navigation />
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>
