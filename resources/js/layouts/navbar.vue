<template>
  <PTabs
    :tabs='[{"id":"dashboard","content":"Dashboard","to":"/"},{"id":"products","content":"Products","to":"/products"},{"id":"customers","content":"Customers","to":"/customers"},{"id":"settings","content":"Settings","to":"/settings"},{"id":"install","content":"Install manuel","to":"/install"}]'
    :selected="0"
    class="navbar__inner"
  >
    <PCardSection>
        <router-view></router-view>
    </PCardSection>
  </PTabs>
</template>

<script>
export default {

}
</script>

<style>
    .navbar__inner{
        min-height: 500px;
    }
</style>
