<template>
  <div>
    <PSpinner v-if="showloading"/>

    <PLayout v-if="!showloading">
      <PLayoutSection oneThird="">
        <status status="20%" :title="allStats.todays_wishlist" shortDescription="Today's wishlists" variant="warning"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status status="10%" :title="allStats.yesterday_wishlist" shortDescription="Yesterday wishlists" variant="success"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status :title="allStats.total_wishlist" shortDescription="Total wishlists"></status>
      </PLayoutSection>
    </PLayout>

    <PLayout v-if="!showloading" class="secondlayout__inner">
    <PLayoutSection oneHalf="">
      <PCard title="Top Wishlist Users">
        <resourceList />
      </PCard>
    </PLayoutSection>
    <PLayoutSection oneHalf="">
      <PCard title="Top Wishlist Products">
        <tableProducts :products="allProducts" />
      </PCard>
    </PLayoutSection>
  </PLayout>
  </div>
</template>

<script>
import status from "../components/cards/status"
import resourceList from "../components/cards/resourceList"
import tableProducts from "../components/cards/tableProducts.vue"
export default {
    components:{status,resourceList,tableProducts},
    computed: {
        allStats(){ //final output from here
            return this.$store.getters['stats/getGlobalStats'];
        },
        allProducts(){ //final output from here
            return this.$store.getters['products/getProducts'];
        }
    },
    data(){
        return {
            showmodal:false,
            showloading:true,
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
        getStats(){
            this.$store.dispatch('stats/allStats').then((response) => {
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
      setTimeout(()=>{
        this.getStats();
        this.fetchProducts();
      },500)
    }
};
</script>
<style >
    .secondlayout__inner{
        margin-top: 20px !important;
    }
    .Polaris-Spinner{
        margin: 0 auto;
        display: flex;
    }
    .hide__header__content .Polaris-ResourceList__HeaderOuterWrapper{
        display: none !important;
    }
    .product__info{
        display: flex !important;
        align-items: center;
        column-gap: 10px;
    }
</style>
