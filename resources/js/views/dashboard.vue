<template>
  <div>
    <PSpinner accessibilityLabel="Spinner Example" v-if="showloading" />
    <PModal
        :open="showmodal"
        sectioned
        :primaryAction='{"content":"Save Customer","disabled":showloading,onAction:sendConfigure}'
        :secondaryActions='[{"content":"Cancel",onAction:()=>{showmodal=false}}]'
        title="Configure your app"
        :loading="showloading"
        @close="showmodal=false"
      >
        <PTextContainer>
        <PHeading>Please configure your app</PHeading>
        <p>
          Shopify POS is the easiest way to sell your products in person. Available
          for iPad, iPhone, and Android.
        </p>
      </PTextContainer>
    </PModal>
    <PLayout v-if="!showloading">
      <PLayoutSection oneThird="">
        <status status="20%" :title="todayStats" shortDescription="Today's wishlists" variant="warning"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status status="10%" :title="yesterdayStats" shortDescription="Yesterday wishlists" variant="success"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status :title="TotalStats" shortDescription="Total wishlists"></status>
      </PLayoutSection>
    </PLayout>
  </div>
</template>

<script>
import status from "../components/cards/status"
export default {
    components:{status},
    data(){
        return {
            showmodal:false,
            showloading:true,
            todayStats:0,
            yesterdayStats:0,
            TotalStats:0,
        }
    },
    methods:{
        getStats(){
            axios.get("/api/v1/dashboard").then((response) => {
                this.todayStats=response.data.todays_wishlist;
                this.yesterdayStats=response.data.yesterday_wishlist;
                this.TotalStats=response.data.total_wishlist;
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
        sendConfigure(param){
            this.showloading=true
            axios.post("/api/configureTheme").then((response) => {
                this.showmodal=false;
                this.showloading=false;
                this.$pToast.open({
                    message: 'App configured',
                    duration:3000,
                    position:"top-right"
                });
            }).catch((err) => {
                this.showmodal=false;
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
        this.getStats();
    }
};
</script>
