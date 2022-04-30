<template>
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
                <PButton primary>Save changes</PButton>
            </PButtonGroup>
      </PCard>
    </PLayoutSection>
    <PLayoutSection oneHalf="">
      <PCard title="Install instructions">
      </PCard>
    </PLayoutSection>
  </PLayout>

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
        showloading:true
    }
},
methods:{
    fetchThemes(){
            this.$store.dispatch('themes/fetchThemes').then((response) => {
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
    this.fetchThemes();
}
}
</script>

<style>
    .themelist__inner {
        overflow: visible !important;
    }
</style>
