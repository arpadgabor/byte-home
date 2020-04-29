<template>
  <label class="block">
    <span class="text-gray-700 text-sm">{{ label }}</span>
    <input
      class="
        form-input block w-full
        focus:shadow-outline hover:border-primary-300
        focus:border-primary-500
        transition-all duration-300
      "
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :name="name"
      :id="name"
      :type="type"
      :value="value"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      @input="onInput($event.target.value)"
    >
  </label>
</template>

<script>
export default {
  props: {
    name: {
      required: true,
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    value: {
      require: true,
      type: String
    },
    placeholder: {
      default: '',
      type: String
    },
    required: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    label: {
      required: true,
      type: String
    },
    autocomplete: {
      required: false,
      type: String
    },
    autofocus: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>

</style>
