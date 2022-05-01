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
                :options='[{"label":"Like","value":"text_with_icon"},{"label":"Stars","value":"only_text"},{"label":"Heart","value":"only_icon"}]'
                :value="buttonOption.icon"
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
      </PCard>
    </PLayoutAnnotatedSection>
  </PLayout>

  <PLayout>
    <PLayoutSection>
      <PCard sectioned="" :actions="[]" subdued :title="'Preview'">
        View a summary of your online store’s performance
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
            type:"text_with_icon",
            background_before:"#B1B1B1",
            background_after:"#FFF",
            text_after:"#FFF",
            text_before:"#C5C5C5",
            icon:"Heart",
            text_after:"Added to Wishlist",
            texte_before:"Add to Wishlist",
            enable_count:false,
            text_size:10,
            icon_size:10
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
.card_container{
    overflow: visible  !important;;
}
.card_container .Polaris-Card__Section{
    padding: 0px !important;
}
.topnav .Polaris-HorizontalDivider{
        margin: 10px 0px;
    }
</style>
