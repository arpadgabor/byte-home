<script>
export default {

}
</script>

<template>
  <nav class="h-16 w-full bg-transparent">
    <div class="container h-full flex flex-row justify-between">
      <div class="h-full flex items-center">
        <span class="font-bold text-primary-600">
          ByteHome
        </span>
      </div>
      <div class="flex flex-row items-center">
        <div class="h-full flex items-center text-gray-800">
          <nuxt-link to="/" class="font-bold p-2" exact-active-class="underline text-primary-600">Dashboard</nuxt-link>
        </div>
        <div class="h-full flex items-center text-gray-800">
          <nuxt-link to="/profile" class="font-bold p-2" active-class="underline text-primary-600">Profile</nuxt-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>

</style>
