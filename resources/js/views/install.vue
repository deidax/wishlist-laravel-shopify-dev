<template>
<div v-if="!showItems">
<PLayout class="topnav">
<PLayoutSection>
      <PBanner  :action="{}"  status="warning">
        <p>Dont forget to set up your settings</p>
      </PBanner>
      <PHorizontalDivider />
    </PLayoutSection>

</PLayout>
<PLayout>

    <PLayoutSection oneHalf="">
        <PCard class="themelist__inner">
            <PCardHeader
            title="Automatic Install"
            shortDescription="Our installation robot will add all the relevant codes to your Shopify theme automatically! We highly recommend creating a duplicate of any theme before proceeding with installation if you do not have a backup ."
            />
            <PCardSection>
                <PMultiSelect
                    floatingLabel
                    label="Pick a Theme"
                    :options='allThemes'
                    textField="name"
                    valueField="id"
                    :value="selectedThemes"
                    placeholder="Select"
                >
            </PMultiSelect>
            </PCardSection>

            <PButtonGroup slot="footer">
                <!-- <PButton>Dismiss</PButton> -->
                <PButton primary>Publish</PButton>
            </PButtonGroup>
      </PCard>
    </PLayoutSection>
    <PLayoutSection oneHalf="">
      <PCard title="Install instructions">
      </PCard>
    </PLayoutSection>
  </PLayout>
</div>
</template>

<script>

export default {
    computed: {
        allThemes(){ //final output from here
            return this.$store.getters['themes/getThemes'];
        }
    },
data(){
    return{
        selectedThemes:[],
        showItems:true
    }
},
methods:{
    fetchThemes(){
            this.$store.dispatch('themes/fetchThemes').then((response) => {
                this.$pLoading.finish();
                this.showItems=false;
            }).catch((err) => {
                this.$pLoading.finish();
                this.showItems=false;
                this.$pToast.open({
                    message: err,
                    duration:3000,
                    position:"top-right"
                })
            })
        },
},
mounted(){
    this.$pLoading.start();
    this.fetchThemes();
}
}
</script>

<style>
    .themelist__inner {
        overflow: visible !important;
    }
    .topnav .Polaris-HorizontalDivider{
        margin: 10px 0px;
    }
</style>
