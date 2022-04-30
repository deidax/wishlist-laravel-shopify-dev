<template>
  <PDataTable
        :resourceName="{singular: 'Product', plural: 'Products'}"
        :headings="[
            {
                content: 'Product',
                value: 'product',
                type: 'text',
                width: '80%'
            },
            {
                content: 'Inventory',
                value: 'totalInventory',
                type: 'numeric',
            },
            {
                content: 'Total customers',
                value: 'number_of_customers',
                type: 'numeric',
            },
        ]"
        :rows="products"
    >
        <template v-slot:item.product="{item}">
            <PLink :url="item.product_link" class="product__info">
                 <PThumbnail
                    source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                    alt="Black choker necklace"
                />
                {{item.title}}
            </PLink>
        </template>
        <template v-slot:item.qty="{item}">
            <PBadge status="attention">
                {{item.qty}}
            </PBadge>
        </template>
    </PDataTable>
</template>

<script>
export default {
    props:["products"]
}
</script>

<style>

</style>
