<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="`btn-${variant}`"
  >
    <slot class="flex flex-row"></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      default: 'submit',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    variant: {
      default: 'primary',

    }
  }
}
</script>

<style></style>
