<template>
  <div>
      <PSpinner v-if="showloading"/>
    <PCard sectioned v-if="!showloading" >
        <PFilter
    :resourceName='{"singular":"Customer","plural":"Customers"}'
    :appliedFilters='[{"value":"Test","key":"test"}]'
    :disabled="false"
  >
    <PButtonGroup segmented="">
      <PPopover id="popover_1" :active="false" fullWidth="">
        <PButton slot="activator" :disabled="false" disclosure="down">
          Account Status
        </PButton>
        <PCard slot="content" sectioned="">
          <PChoiceList
            title="Account Status"
            :options='[{"label":"Enabled","value":"enabled"},{"label":"Not invited","value":"not invited"},{"label":"Invited","value":"invited"},{"label":"Declined","value":"declined"}]'
            textField="label"
            valueField="value"
            :selected="[]"
            allowMultiple=""
            titleHidden=""
          />
        </PCard>
      </PPopover>
      <PPopover id="popover_2" :active="false" fullWidth="">
        <PButton slot="activator" :disabled="false" disclosure="down">
          Status
        </PButton>
        <PCard slot="content">
          <PCardSection>
            <PStack vertical="" spacing="tight">
              <PStackItem>
                <PTextField label="Tagged with" labelHidden="" value="" />
              </PStackItem>
              <PStackItem><PButton plain="">Clear</PButton></PStackItem>
            </PStack>
          </PCardSection>
        </PCard>
      </PPopover>
      <PButton :disabled="false">Search</PButton>
    </PButtonGroup>
  </PFilter>
    <PIndexTable
        :rows="products"
        :itemCount="products.length"
        :appliedFilters="[
            {
                'value': tag,
                'key': 'test'
            },
        ]"
        :resourceName="{
            singular: 'product',
            plural: 'products',
        }"
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
                title: 'Status',
                value: 'product_status',
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
                title: 'Number of customers',
                value: 'number_of_customers',
            },
        ]"
        :bulkActions="[
            {
                content: 'Add tags',
                onAction: () => console.log('Todo: implement bulk add tags'),
            },
            {
                content: 'Remove tags',
                onAction: () => console.log('Todo: implement bulk remove tags'),
            },
            {
                content: 'Delete customers',
                onAction: () => console.log('Todo: implement bulk delete'),
            },
        ]"
        :hasMoreItems="true"
        :promotedBulkActions="[
            {
                title: 'Menu',
                actions: [
                    {
                        helpText: 'Promoted BulkActions Menu',
                        onAction: () => console.log('Todo: implement promoted bulk actions menu'),
                    },
                ],
            },
            {
                content: 'Edit customers',
                onAction: () => console.log('Todo: implement bulk edit'),
            },
        ]"
        :lastColumnSticky="true"
        :pagination="{
            hasPrevious: true,
            hasNext: true,
            onNext: () => {
                alert('Next');
            },
            onPrevious: () => {
                alert('Previous');
            },
        }"
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
        <template v-slot:item.product_status="{item}">
            <PBadge v-if="item.product_status === 'Draft'" status="info">
                {{ item.product_status }}
            </PBadge>
            <PBadge v-else-if="item.product_status === 'Active'" status="success">
                {{ item.product_status }}
            </PBadge>
            <PBadge v-else>
                {{ item.product_status }}
            </PBadge>
        </template>
    </PIndexTable>
</PCard>
  </div>
</template>

<script>

export default {
data(){
    return{
        products :[],
        showloading:true
    }
},
methods:{
    fetchProducts(){
        axios.get("/api/v1/products").then((response) => {
                this.products=response.data.data;
                this.showloading=false
            }).catch((err) => {
                this.showloading=false
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
