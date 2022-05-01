<template>
  <div>
    <PLayout>
    <PLayoutAnnotatedSection
      title="Button Details"
      description="Define the look-and-feel of the Wishlist button on your product pages Or on collection page"
    >
      <PCard sectioned="" :actions="[]" class="card_container">
        <PAccordion id="Polaris-Accordion">
        <PAccordionItem
        >
        <template slot="title">Apparence</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" />
        </template>
        <div slot="content">
            <PFormLayout>
                <PHeading element="h1">Button type</PHeading>
                <PSelect
                :options='[{"label":"Text with icon","value":"text_with_icon"},{"label":"Only text","value":"only_text"},{"label":"Only icon","value":"only_icon"}]'
                :value="buttonOption.type"
                />
                <PSelect
                label="Wishlist Button Icon"
                name="button_icon"
                :options='[{"label":"Like","value":"like"},{"label":"Star","value":"star"},{"label":"Heart","value":"heart"}]'
                :value="buttonOption.button_icon"
                />
                <PHeading element="h1">Colors</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'47%'"><PColorPicker label="background" id="color-picker" @change="(el)=>{buttonOption.background_before=el.hex}" :color="buttonOption.background_before" /></PStackItem>
                    <PStackItem :fill="false" :width="'47%'"><PColorPicker label="Text/Icon" id="color-picker" @change="(el)=>{buttonOption.background_after=el.hex}" :color="buttonOption.background_after"/></PStackItem>
                </PStack>
                <PHeading element="h1">Typography</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'47%'">
                        <PRangeSlider
                            label="Text size"
                            :min="8"
                            :max="30"
                            @change="(el)=>{buttonOption.text_size=el.value}" :value="buttonOption.text_size"
                        />
                    </PStackItem>
                    <PStackItem :fill="false" :width="'47%'">
                        <PRangeSlider
                            label="Icon size"
                            :min="8"
                            :max="30"
                            @change="(el)=>{buttonOption.icon_size=el.value}" :value="buttonOption.icon_size"
                        />
                    </PStackItem>
                </PStack>
                <PHeading element="h1">Spacing</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'22%'"><PTextField label="Inside top" type="number" align="left" suffix="px" /></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField label="Inside bottom" type="number" align="left" suffix="px" /></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField label="Inside left" type="number" align="left" suffix="px"/></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField label="Inside right" type="number" align="left" suffix="px"/></PStackItem>
                </PStack>
                <PHeading element="h1">Border</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'30%'"><PTextField label="Width" type="number" align="left" suffix="px" /></PStackItem>
                    <PStackItem :fill="false" :width="'30%'"><PTextField label="Radius" type="number" align="left" suffix="px" /></PStackItem>
                    <PStackItem :fill="false" :width="'30%'"><PColorPicker label="Color" @change="(el)=>{buttonOption.background_before=el.hex}" :color="buttonOption.background_before" /></PStackItem>
                </PStack>
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

  <PLayout class="mt-2">
    <PLayoutSection>
      <PCard sectioned="" :actions="[]" subdued :title="'Preview'">
        Button generated style
        <PButtonGroup slot="footer">
            <PButton primary>Save</PButton>
        </PButtonGroup>
      </PCard>
    </PLayoutSection>
  </PLayout>
    <PHorizontalDivider class="topnav" />
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
    //this.configureTheme()
}
}
</script>

<style>
    .card_container{
        overflow: visible  !important;;
    }
    .card_container .Polaris-Card__Section{
        padding: 0px !important;
    }
    .topnav .Polaris-HorizontalDivider{
        margin: 10px 0px;
    }
    .mt-2{
        margin-top: 20px;
    }
</style>
