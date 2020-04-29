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
  <div class="min-h-screen w-full">
    <navigation />
    <nuxt />
  </div>
</template>
