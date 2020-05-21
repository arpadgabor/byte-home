<script>
export default {
}
</script>

<template>
  <header class="w-full py-20 bg-transparent text-blue-800">
    <div class="flex flex-row justify-between">
      <slot name="title"></slot>
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<style>

</style>
