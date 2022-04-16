<template>
<PCard :sectioned="false" :subdued="true">
            <PCardHeader
            :title="title"
            :shortDescription="shortDescription"
            v-slot:children
            >
            <PBadge :status="variant" v-if="status">{{status}}</PBadge>
            </PCardHeader>
        </PCard>
</template>

<script>
export default {
props:[
    "title","shortDescription","status","variant"
]
}
</script>

<style scoped>
    .Polaris-Card__Header{
        padding-bottom: 2rem !important;
    }
</style>
