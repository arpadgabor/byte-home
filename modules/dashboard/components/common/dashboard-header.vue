<script>
export default {
}
</script>

<template>
  <header class="w-full py-20 bg-gray-800 text-white">
    <div class="container flex flex-row justify-between">
      <slot name="title"></slot>
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<style>

</style>
