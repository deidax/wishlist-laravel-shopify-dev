<template>
  <div>
    <PSpinner v-if="showloading"/>
  <PCard v-if="!showloading">
    <PResourceList
      :selectable="false"
      hasMore
      :resourceName='{"singular":"Customer","plural":"Customers"}'
      :sortOptions='[{"label":"Newest update","value":"DATE_MODIFIED_DESC","disabled":false},{"label":"Oldest update","value":"DATE_MODIFIED_ASC","disabled":false}]'
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
        <PAvatar slot="media" size="medium" customer="" name="PHP" />
        <div class="resource-list-item">
          <div class="resource-list-item__book--name"><p>PHP</p></div>
          <div class="resource-list-item__resource--status">
            <h3><PTextStyle variation="positive">Published</PTextStyle></h3>
          </div>
        </div>
      </PResourceListItem>
    </PResourceList>
    <PCardSection>
      <PStack distribution="center">
        <PPagination hasNext hasPrevious :total="allCustomers.length" />
      </PStack>
    </PCardSection>
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

</style>
