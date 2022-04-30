<template>
  <div>
    <PSpinner v-if="showloading"/>
  <PCard v-if="!showloading">
    <PResourceList
      :selectable="false"
      hasMore
      :resourceName='{"singular":"Customer","plural":"Customers"}'
      :totalCount="allCustomers.length"
    >
      <PResourceListItem
        v-for="customer in allCustomers"
        :key="customer.id"
        :selectable="false"
        :loading="false"
        :selectMode="false"
        :shortcutActions='[{"content":"View listed products"}]'
      >
        <PAvatar slot="media" size="medium" :customer="true" :name="customer.displayName" />
        <div class="resource-list-item resourse-ist-item__inner">
            <div class="info__panel"><div class="resource-list-item__book--name"><p>{{customer.displayName}}</p></div>
          <div class="resource-list-item__resource--status">
            <h3><PTextStyle variation="positive">{{customer.numbre_price_wishlisted}}</PTextStyle> Item to wishlist</h3>
          </div>
          </div>
            <h3><PTextStyle variation="positive">{{customer.string_price_wishlisted}}</PTextStyle> Total of wishlisted products</h3>
        </div>
      </PResourceListItem>
    </PResourceList>
  </PCard>
  </div>
</template>

<script>
export default {
    computed: {
        allCustomers(){ //final output from here
            return this.$store.getters['customers/getCustomers'];
        }
    },
data(){
    return{
        showloading:true
    }
},
methods:{
    fetchCustomers(){
            this.$store.dispatch('customers/fetchCustomers').then((response) => {
                this.showloading=false;
            }).catch((err) => {
                this.showloading=false;
                this.$pToast.open({
                    message: err,
                    duration:3000,
                    position:"top-right"
                })
            })
        },
},
mounted(){
    this.fetchCustomers();
}
}
</script>

<style>
    .resourse-ist-item__inner{
        display: flex;
        column-gap: 80px;
    }
</style>
