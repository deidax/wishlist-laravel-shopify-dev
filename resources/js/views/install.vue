<template>
<PLayout>
    <PLayoutSection oneHalf="">
        <PCard :sectioned="false">
            <PCardHeader
            title="Theme publishing"
            shortDescription="Please select the themes you want to be activated"
            />
            <PCardSection>
                <PMultiSelect
                    label="Sort by"
                    :options='[{"label":"Vue.js","language":"vue.js"},{"label":"Rails","language":"rails"},{"label":"Laravel","language":"laravel","hidden":true},{"label":"Phoenix","language":"phoenix","disabled":true,"$isDisabled":true}]'
                    textField="label"
                    valueField="language"
                    :value="null"
                    placeholder="Select"
                />
            </PCardSection>

            <PButtonGroup slot="footer">
                <PButton>Dismiss</PButton>
                <PButton primary>Save changes</PButton>
            </PButtonGroup>
      </PCard>
    </PLayoutSection>
    <PLayoutSection oneHalf="">
      <PCard title="Top Wishlist Products">
        <tableProducts :products="allProducts" />
      </PCard>
    </PLayoutSection>
  </PLayout>

</template>

<script>
export default {

}
</script>

<style>

</style>
