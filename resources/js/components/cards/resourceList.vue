<template>
  <PResourceList
      :selectable="false"
      hasMore
      :resourceName='{"singular":"Customer","plural":"Customers"}'
      :totalCount="customers.length"
    >
      <PResourceListItem
        v-for="customer in customers"
        :key="customer.id"
        :selectable="false"
        :selectMode="false"
        persistActions=""
        :shortcutActions='[{"content":"View wishlists"}]'
      >
        <PAvatar slot="media" size="medium" :customer="true" :name="customer.displayName" />
        <div class="resource-list-item">
            <div class="resource-list-item__book--name"><p>{{customer.displayName}}</p></div>
          <div class="resource-list-item__resource--status">
            <h3><PTextStyle variation="positive">{{customer.number_wishlisted}}</PTextStyle> Item to wishlist</h3>
            <h3><PTextStyle variation="positive">{{customer.string_price_wishlisted}}</PTextStyle> Total of wishlisted products</h3>
          </div>
        </div>
      </PResourceListItem>
    </PResourceList>
</template>

<script>
export default {
    props:["customers"],
}
</script>

<style>

</style>
