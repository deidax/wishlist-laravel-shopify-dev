<template>
  <div>
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
    <PLayout>
      <PLayoutSection oneThird="">
        <status status="20%" title="32" shortDescription="Today's wishlists" variant="warning"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status status="10%" title="20" shortDescription="Yesterday wishlists" variant="success"></status>
      </PLayoutSection>
      <PLayoutSection oneThird="">
        <status title="4420" shortDescription="Total wishlists"></status>
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
            showloading:false,
        }
    },
    methods:{
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
        }
    },
    mounted(){
        this.showmodal=true;
    }
};
</script>

<style>
</style>
