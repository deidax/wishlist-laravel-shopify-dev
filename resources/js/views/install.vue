<template>
<div v-if="!showItems">
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
          <PCardSection>
              <p class="mb-2">Open Online store > Themes > Actions -> Edit code and paste this shortcode in the desired place. <b>Don't forget to set up your settings.</b></p>

              <PTextField id="input_field_code" connected type="text" :value="optionSettings" disabled>
                <PButton slot="connectedRight" v-p-tooltip="'Copy'" @click="copyCode" ><PIcon source="ClipboardMinor" /></PButton>
            </PTextField>
          </PCardSection>

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
        showItems:true,
        optionSettings:'<div id="ws_button_data" data-customer="{{ customer.id }}" data-product="{{ product.id }}" data-product_price="{{ product.price | money_without_currency }}">Loading Button...</div>'
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
        copyCode(){

            var copyText = document.querySelector("#input_field_code");
            copyText.select();
            document.execCommand("copy");
            this.$pToast.open({
                message: "Copying to clipboard was successful",
                duration:3000,
                position:"top-right"
           })
        }
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
    .mb-2{
        margin-bottom: 10px;
    }
</style>
