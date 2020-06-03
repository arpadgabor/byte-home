<script>
import navigation from '@/components/common/navigation'
import globalDialog from '@/components/common/dialog-base'

export default {
  components: {
    navigation,
    globalDialog
  },
  mounted() {
    this.$store.dispatch('auth/startTimer')
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-gray-100">
    <navigation />
    <global-dialog />
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>
