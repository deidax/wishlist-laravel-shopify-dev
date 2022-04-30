<template>
  <div>
    <PSpinner v-if="showloading"/>
    <PCard sectioned v-if="!showloading" >
    <PIndexTable
        :rows="allProducts"
        :itemCount="allProducts.length"
        :hasFilter="true"
        :resourceName="{
            singular: 'product',
            plural: 'products',
        }"
        :selectable="false"
        :clickableRow="false"
        :headings="[
            {
                title: '',
                value: 'image',
            },
            {
                title: 'Product',
                value: 'title',
            },
            {
                title: 'Inventory',
                value: 'totalInventory',
            },
            {
                title: 'Price',
                value: 'price',
            },
            {
                title: 'Vendor',
                value: 'vendor',
            },
            {
                title: 'Sku code',
                value: 'sku',
            },
            {
                title: 'Number of customers',
                value: 'number_of_customers',
            },
            {
                content: 'Actions',
                value: 'actions',
                type: 'text',
                sortable: false,
            },
        ]"
    >
        <template v-slot:item.image="{ item }">
            <div style="height: 93px; display: block; padding: 15px 0 15px 0;">
                <PThumbnail
                    source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                    :alt="item.name"
                />
            </div>
        </template>
        <template v-slot:item.product="{item}">
            <PLink url="javascript:void(0)">
                {{ item.name }}
            </PLink>
        </template>
        <template v-slot:item.actions="{item}">
            <PStack>
                        <PStackItem>
                            <PIcon source="ViewMajor" />
                        </PStackItem>
                    </PStack>
        </template>
    </PIndexTable>
</PCard>
  </div>
</template>

<script>

export default {
    computed: {
        allProducts(){ //final output from here
            return this.$store.getters['products/getProducts'];
        }
    },
data(){
    return{
        showloading:true
    }
},
methods:{
    fetchProducts(){
            this.$store.dispatch('products/fetchProducts').then((response) => {
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
    this.fetchProducts();
}
}
</script>

<style>
</style>
