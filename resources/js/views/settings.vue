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
                :options='[{"label":"Text with icon","value":"text_with_icon"},{"label":"Only text","value":"only_text"},{"label":"Only icon","value":"only_icon"}]'
                :value="buttonOption.type"
                />
                <PColorPicker label="Pick a color of the background button/icon before user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.background_before=el.hex}" :color="buttonOption.background_before" />
                <PColorPicker label="Pick a color of the background button/icon after user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.background_after=el.hex}" :color="buttonOption.background_after"/>
                <PColorPicker label="Pick a color of the button/icon before user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.text_before=el.hex}" :color="buttonOption.text_before" />
                <PColorPicker label="Pick a color of the button/icon after user has added to their Wishlist" id="color-picker" @change="(el)=>{buttonOption.text_after=el.hex}" :color="buttonOption.text_after" />
                <PSelect
                label="Wishlist Button Icon"
                :options='[{"label":"Like","value":"text_with_icon"},{"label":"Stars","value":"only_text"},{"label":"Heart","value":"only_icon"}]'
                :value="buttonOption.icon"
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
                <PTextField label="Before Adding to Wishlist" connected @input="(el)=>{buttonOption.texte_before=el.value}" :value="buttonOption.texte_before"/>
                <PTextField
                label="After Adding to Wishlist" connected @input="(el)=>{buttonOption.text_after=el.value}" :value="buttonOption.text_after"
                />
            </PFormLayout>
        </div>
        </PAccordionItem>
        <PAccordionItem
        >
        <template slot="title">Social Icons</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" />
        </template>
        <div slot="content">
            <PToggle label="Display a count of how many users have added this item to their Wishlist" @change="(el)=>{buttonOption.enable_count=el.value}" :value="buttonOption.enable_count" />
        </div>
        </PAccordionItem>
    </PAccordion>

        <PButtonGroup slot="footer">
                <!-- <PButton>Dismiss</PButton> -->
                <PButton primary>Save changes</PButton>
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
            type:"text_with_icon",
            background_before:"#B1B1B1",
            background_after:"#FFF",
            text_after:"#FFF",
            text_before:"#C5C5C5",
            icon:"Heart",
            text_after:"Added to Wishlist",
            texte_before:"Add to Wishlist",
            enable_count:false
        }
    }
},
methods:{
    updateColor(sel){
        console.log(sel)
    }
},
mounted(){
}
}
</script>

<style>

</style>
