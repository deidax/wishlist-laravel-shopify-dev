<template>
  <div>
      {{products}}
      <PEmptyState
        heading="Products wishlisted"
        :image="require('../images/empty-state.png')"
        v-if="products.length==0"
    >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo unde libero, ipsa voluptatem iusto numquam minima deleniti. At consequatur aperiam pariatur quis esse hic harum, officiis, est provident error cum!</p>
    </PEmptyState>

  <PCard sectioned>
    <PDataTable
        :resourceName="{singular: 'Product', plural: 'Products'}"
        :headings="[
            {
                content: 'Product',
                value: 'product',
                type: 'text',
                width: '30%'
            },
            {
                content: 'Price',
                value: 'price',
                type: 'numeric',
            },
            {
                content: 'SKU Number',
                value: 'sku',
                type: 'numeric',
            },
            {
                content: 'Net quantity',
                value: 'qty',
                type: 'numeric',
            },
            {
                content: 'Status',
                value: 'status',
                type: 'text',
                sortable: false,
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
                product_link: 'javascript:void(0);',
                price: '$875.00',
                sku: 124689,
                sku_status: 'critical',
                sku_progress: 'incomplete',
                qty: 140,
                status: true,
                total_customers:5
            },
            {
                product: 'Mauve Cashmere Scarf',
                product_link: 'javascript:void(0);',
                price: '$230.00',
                sku: 124533,
                sku_status: 'warning',
                sku_progress: 'partiallyComplete',
                qty: 83,
                status: false,
                total_customers:3
            },
            {
                product: 'Navy Merino Wool Blazer with khaki chinos and yellow belt',
                product_link: 'javascript:void(0);',
                price: '$445.00',
                sku: 124518,
                sku_status: 'success',
                sku_progress: 'complete',
                qty: 32,
                status: true,
                total_customers:5
            },
        ]"
        :hasPagination="true"
        :pagination="{
            hasPrevious: true,
            hasNext: true,
            onNext: () => {
                alert('Next');
            },
            onPrevious: () => {
                alert('Previous');
            }
        }"
    >
        <template v-slot:item.product="{item}">
            <PLink :url="item.product_link">
                {{item.product}}
            </PLink>
        </template>
        <template v-slot:item.sku="{item}">
            <PBadge :status="item.sku_status" :progress="item.sku_progress">
                {{item.sku}}
            </PBadge>
        </template>
        <template v-slot:item.status="{item}">
            <PBadge :status="item.sku_status">
                active
            </PBadge>
        </template>
    </PDataTable>
</PCard>
  </div>
</template>

<script>

export default {
data(){
    return{
        products :[]
    }
},
methods:{
    fetchProducts(){
        axios.get("/api/v1/products").then((response) => {
            console.log(response)
                this.products=response.data;
            }).catch((err) => {
                this.$pToast.open({
                    message: err,
                    duration:3000,
                    position:"top-right"
                })
            })
    }
},
mounted(){
    this.fetchProducts();
}
}
</script>

<style>

</style>
