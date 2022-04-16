<template>
  <PTabs
    :tabs='[{"id":"dashboard","content":"Dashboard","to":"/","badge":{"content":"10+","status":"critical"}},{"id":"products","content":"Products","to":"/products"},{"id":"customers","content":"Customers","to":"/customers"},{"id":"settings","content":"Settings","to":"/settings"}]'
    :selected="0"
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

</style>
