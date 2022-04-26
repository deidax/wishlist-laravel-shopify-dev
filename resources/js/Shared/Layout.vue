<template>
  <div>
    <section class="p-6 bg-gray-200">
      <header class="flex justify-between">
        <div class="flex items-center">
          <h1 class="font-bold text-lg">Laravel Inertia</h1>
          <p class="text-sm ml-4">Welcome !</p>
        </div>
        <Nav />
      </header>
    </section>

    <section class="p-6">
      <div class="max-w-3xl mx-auto">
        <iframe
          class="my-5"
          width="100%"
          frameborder="no"
          scrolling="no"
          seamless
          src="https://player.simplecast.com/fd0bd2ba-c553-466c-a060-b144797ce369?dark=false"
        ></iframe>
        <slot />
      </div>
    </section>
  </div>
</template>

<script>
import Nav from "./Nav";
export default {
  components: { Nav },

//   computed: {
//     username() {
//       return this.$page.props.auth.user.username;
//     },
//   },
};
</script>

<style>
</style>