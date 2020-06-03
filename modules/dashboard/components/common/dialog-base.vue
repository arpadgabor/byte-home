<script>
import { mapState } from 'vuex'

import ClickOutside from 'vue-click-outside'
import editHousehold from '@/components/dashboard/households/edit-household-dialog'

export default {
  components: {
    editHousehold
  },
  computed: {
    modal() {
      return this.$store.state.modal.name
    }
  },
  directives: {
    ClickOutside
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/close')
    }
  }
}
</script>

<template>
  <div
    v-if="modal"
    class="absolute h-screen w-screen left-0 top-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="card default w-full sm:w-1/2 md:w-1/3 lg:w-1/4" v-click-outside="closeModal">
      <component :is="modal" />
    </div>
  </div>
</template>

<style></style>
