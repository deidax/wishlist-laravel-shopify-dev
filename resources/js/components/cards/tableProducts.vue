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
                content: 'Net quantity',
                value: 'qty',
                type: 'numeric',
            },
            {
                content: 'Total customers',
                value: 'total_customers',
                type: 'numeric',
            },
        ]"
        :rows="[
            {
                product: 'Emerald Silk Gown',
                qty: 140,
                total_customers:5
            },
            {
                product: 'Mauve Cashmere Scarf',
                qty: 83,
                total_customers:3
            },
            {
                product: 'Navy Merino Wool Blazer with khaki chinos and yellow belt',
                qty: 32,
                total_customers:5
            },
            {
                product: 'Navy Merino Wool Blazer with khaki chinos and yellow belt',
                qty: 32,
                total_customers:5
            },
            {
                product: 'Navy Merino Wool Blazer with khaki chinos and yellow belt',
                qty: 32,
                total_customers:5
            },
        ]"
    >
        <template v-slot:item.product="{item}">
            <PLink :url="item.product_link" class="product__info">
                 <PThumbnail
                    source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                    alt="Black choker necklace"
                />
                {{item.product}}
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

}
</script>

<style>

</style>
