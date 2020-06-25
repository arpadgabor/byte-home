<script>
import { mapState } from 'vuex'

import ClickOutside from 'vue-click-outside'
import editHousehold from '@/components/dashboard/households/edit-household-dialog'
import newDevice from '@/components/dashboard/devices/add-device-dialog'

export default {
  components: {
    editHousehold,
    newDevice
  },
  computed: {
    modal() {
      return this.$store.state.modal.name
    },
    modalTitle() {
      return this.$store.state.modal.title
    }
  },
  directives: {
    ClickOutside
  },
  methods: {
    closeModal() {
      if(this.modal)
        this.$store.commit('modal/close')
    }
  }
}
</script>

<template>
  <div
    v-if="modal"
    class="absolute h-screen w-screen left-0 top-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-3"
  >
    <div class="card default relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <button
        id="modal-close"
        class="absolute right-0 top-0 p-2 -mt-2 -mr-2 bg-white shadow-xl text-gray-700 hover:text-white hover:bg-red-600 rounded-full transition duration-200" @click="closeModal"
      >
        <i class="gg-close"></i>
      </button>
      <h2 class="h2 mb-4">{{ modalTitle }}</h2>
      <component :is="modal" />
    </div>
  </div>
</template>

<style></style>
