<template>
  <div>
    <PLayout>
    <PLayoutSection
    >
      <PCard sectioned="" :actions="[]" class="card_container" title="Button Details" shortDescription="Define the look-and-feel of the Wishlist button on your product pages Or on collection page">
        <PAccordion id="Polaris-Accordion">
        <PAccordionItem
        >
        <template slot="title">Apparence</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" color="success" />
        </template>
        <div slot="content">
            <PFormLayout>
                <PHeading element="h1">Button type</PHeading>
                <PSelect
                :options='[{"label":"Text with icon","value":"text_icon"},{"label":"Only text","value":"only_text"},{"label":"Only icon","value":"only_icon"}]'
                :value="buttonOption.button_type"
                @change="(el)=>{buttonOption.button_type=el}"
                id="button_type"
                />
                <PSelect
                label="Wishlist Button Icon"
                name="button_icon"
                :options='[{"label":"Like","value":"like"},{"label":"Heart","value":"heart"},{"label":"Stars","value":"star"}]'
                @change="(el)=>{buttonOption.button_icon=el}"
                 :value="buttonOption.button_icon"
                id="button_icon"
                />
                <PHeading element="h1">Colors</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'47%'"><PColorPicker label="background" id="bg_color" @change="(el)=>{buttonOption.bg_color=el.hex8}" :color="buttonOption.bg_color" /></PStackItem>
                    <PStackItem :fill="false" :width="'47%'"><PColorPicker label="Text/Icon" id="text_color" @change="(el)=>{buttonOption.text_color=el.hex8}" :color="buttonOption.text_color"/></PStackItem>
                </PStack>
                <PHeading element="h1">Typography</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'47%'">
                        <PRangeSlider
                            label="Text size"
                            :min="8"
                            :max="30"
                            id="text_size"
                            @change="(el)=>{buttonOption.text_size=el}" :value="buttonOption.text_size"
                        />
                    </PStackItem>
                    <PStackItem :fill="false" :width="'47%'">
                        <PRangeSlider
                            label="Icon size"
                            :min="8"
                            :max="30"
                            id="icon_size"
                            @change="(el)=>{buttonOption.icon_size=el}" :value="buttonOption.icon_size"
                        />
                    </PStackItem>
                </PStack>
                <PHeading element="h1">Spacing</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'22%'"><PTextField id="paddingtop" label="Inside top" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.paddingtop=el}" :value="buttonOption.paddingtop" /></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField id="paddingbottom" label="Inside bottom" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.paddingbottom=el}" :value="buttonOption.paddingbottom" /></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField id="paddingleft" label="Inside left" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.paddingleft=el}" :value="buttonOption.paddingleft"/></PStackItem>
                    <PStackItem :fill="false" :width="'22%'"><PTextField id="paddingright" label="Inside right" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.paddingright=el}" :value="buttonOption.paddingright"/></PStackItem>
                </PStack>
                <PHeading element="h1">Border</PHeading>
                <PStack>
                    <PStackItem :fill="false" :width="'30%'"><PTextField id="borderwidth" label="Width" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.borderwidth=el}" :value="buttonOption.borderwidth"/></PStackItem>
                    <PStackItem :fill="false" :width="'30%'"><PTextField id="borderradius" label="Radius" type="number" align="left" suffix="px" @input="(el)=>{buttonOption.borderradius=el}" :value="buttonOption.borderradius"/></PStackItem>
                    <PStackItem :fill="false" :width="'30%'"><PColorPicker id="bordercolor" label="Color" @change="(el)=>{buttonOption.bordercolor=el.hex}" :color="buttonOption.bordercolor" /></PStackItem>
                </PStack>
            </PFormLayout>
        </div>
        </PAccordionItem>
        <PAccordionItem
        >
        <template slot="title">Labels</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" color="success" />
        </template>
        <div slot="content">
            <PFormLayout>
                <PTextField name="btn_label_before" label="Before Adding to Wishlist" id="btn_label_before" connected @input="(el)=>{buttonOption.btn_label_before=el}" :value="buttonOption.btn_label_before"/>
                <PTextField
                name="btn_label_after"
                label="After Adding to Wishlist" id="btn_label_after" connected @input="(el)=>{buttonOption.btn_label_after=el}" :value="buttonOption.btn_label_after"
                />
            </PFormLayout>
        </div>
        </PAccordionItem>
        <PAccordionItem
        >
        <template slot="title">Display social count</template>
        <template slot="actions">
            <PIcon source="CircleUpMajor" color="success" />
        </template>
        <div slot="content">
            <PToggle id="display_social_count" name="display_social_count" label="Display a count of how many users have added this item to their Wishlist" @change="(el)=>{buttonOption.display_social_count=el.checked}" />
        </div>
        </PAccordionItem>
    </PAccordion>
      </PCard>
    </PLayoutSection>
    <PLayoutSection secondary="">
      <PCard sectioned="" :actions="[]" subdued :title="'Preview'">
        <preview :options="buttonOption"></preview>
        <PButtonGroup slot="footer">
            <PButton primary @click="saveSettings">Save</PButton>
        </PButtonGroup>
      </PCard>
    </PLayoutSection>
  </PLayout>
  </div>
</template>

<script>
import preview from "../components/preview"
export default {
    components:{preview},
data(){
    return{
        themes :[],
        selectedColor:"#B1B1B1",
        buttonOption:{
            button_type:"text_icon",
            bg_color:"#B1B1B1",
            text_color:"#5C5C5C",
            button_icon:"heart",
            text_size:15,
            icon_size:15,
            paddingtop:5,
            paddingbottom:5,
            paddingleft:5,
            paddingright:5,
            borderwidth:1,
            bordercolor:"#bababa",
            borderradius:0,
            btn_label_after:"Added to Wishlist",
            btn_label_before:"Add to Wishlist",
            display_social_count:false
        }
    }
},
methods:{
    updateColor(el){
        console.log(el)
    },
    //Api call exemple
    //use this with a click event
    saveSettings(){
        let wishlist_settings_params = {button:this.buttonOption,innerHtml:document.getElementById('wh_button_handle').outerHTML}
        axios.post("/api/v1/configure-theme", wishlist_settings_params).then((response) => {
            console.log(response)
                this.themes=response.data;
            }).catch((err) => {
                this.$pToast.open({
                    message: err,
                    duration:3000,
                    position:"top-right"
                })
            })
        // let wishlist_settings_params = {shop_id:"appstoreplayground.myshopify.com",shop_active_theme_id:122979975191}
        // axios.post("/api/v1/get-button-params", wishlist_settings_params).then((response) => {
        //     console.log(response)
        //         this.themes=response.data;
        //     }).catch((err) => {
        //         this.$pToast.open({
        //             message: err,
        //             duration:3000,
        //             position:"top-right"
        //         })
        //     })
    }
    // saveSettings(){
    //     console.log('wishlist_settings_params',wishlist_settings_params)
    // }
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
