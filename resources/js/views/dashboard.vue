<template>
  <div>
    <PSpinner accessibilityLabel="Spinner Example" v-if="showloading" />
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
    computed: {
        getAllStats(){ //final output from here
            return this.$store.getters['stats/getGlobalStats'];
        }
    },
    data(){
        return {
            showmodal:false,
            showloading:true,
        }
    },
    methods:{
        getStats(){
            this.$store.dispatch('stats/allStats').then((response) => {
                debugger
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
    },
    mounted(){
      setTimeout(()=>{
        this.getStats();
      },500)
    }
};
</script>
