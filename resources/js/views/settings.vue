<template>
  <div>
    <PLayout>
    <PLayoutAnnotatedSection
      title="Button Details"
      description="Define the look-and-feel of the Wishlist button on your product pages Or on collection page"
    >
      <PCard sectioned="" :actions="[]">
        <PAccordion id="Polaris-Accordion">
        <PAccordionItem
        >
        <template slot="title">Apparence</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" />
        </template>
        <div slot="content">
            <PFormLayout>
                <PSelect
                label="Wishlist Button Type"
                name="button_type"
                :options='[{"label":"Text with icon","value":"text_icon"},{"label":"Only text","value":"text"},{"label":"Only icon","value":"icon"}]'
                :value="buttonOption.button_type"
                />
                <PColorPicker name="bg_color_before" label="Pick a color of the background button/icon before user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.bg_color_before=el.hex}" :color="buttonOption.bg_color_before" />
                <PColorPicker name="bg_color_after" label="Pick a color of the background button/icon after user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.bg_color_after=el.hex}" :color="buttonOption.bg_color_after"/>
                <PColorPicker name="text_color_before" label="Pick a color of the button/icon before user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.text_color_before=el.hex}" :color="buttonOption.text_color_before" />
                <PColorPicker name="text_color_after" label="Pick a color of the button/icon after user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.text_color_after=el.hex}" :color="buttonOption.text_color_after" />
                <PSelect
                label="Wishlist Button Icon"
                name="button_icon"
                :options='[{"label":"Like","value":"like"},{"label":"Star","value":"star"},{"label":"Heart","value":"heart"}]'
                :value="buttonOption.button_icon"
                />

            </PFormLayout>
        </div>
        </PAccordionItem>
        <PAccordionItem
        >
        <template slot="title">Labels</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" />
        </template>
        <div slot="content">
            <PFormLayout>
                <PTextField name="btn_label_before" label="Before Adding to Wishlist" connected @input="(el)=>{buttonOption.btn_label_before=el.value}" :value="buttonOption.btn_label_before"/>
                <PTextField
                name="btn_label_after"
                label="After Adding to Wishlist" connected @input="(el)=>{buttonOption.btn_label_after=el.value}" :value="buttonOption.btn_label_after"
                />
            </PFormLayout>
        </div>
        </PAccordionItem>
        <PAccordionItem
        >
        <template slot="title">Display social count</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" />
        </template>
        <div slot="content">
            <PToggle name="display_social_count" label="Display a count of how many users have added this item to their Wishlist" @change="(el)=>{buttonOption.display_social_count=el.value}" :value="buttonOption.display_social_count" />
        </div>
        </PAccordionItem>
    </PAccordion>

        <PButtonGroup slot="footer">
                <!-- <PButton>Dismiss</PButton> -->
                <PButton primary v-on:click="updateColor">Save changes</PButton>
            </PButtonGroup>
      </PCard>
    </PLayoutAnnotatedSection>
  </PLayout>
  </div>
</template>

<script>
export default {
data(){
    return{
        themes :[],
        selectedColor:"#B1B1B1",
        buttonOption:{
            button_type:"text_icon",
            bg_color_before:"#B1B1B1",
            bg_color_after:"#FFF",
            text_color_before:"#FFF",
            text_color_after:"#C5C5C5",
            button_icon:"heart",
            btn_label_after:"Added to Wishlist",
            btn_label_before:"Add to Wishlist",
            display_social_count:true
        }
    }
},
methods:{
    updateColor(){
        console.log(this.buttonOption)
    },
    //Api call exemple
    //use this with a click event
    configureTheme(){
        axios.post("/api/v1/configure-theme", this.buttonOption).then((response) => {
            console.log(response)
                this.themes=response.data;
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

}
}
</script>

<style>

</style>
