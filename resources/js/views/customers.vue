<template>
  <div>
    <h1>customers</h1>
  {{customers}}
  </div>
</template>

<script>
export default {
data(){
    return{
        customers :[]
    }
},
methods:{
    fetchProducts(){
        axios.get("/api/v1/customers").then((response) => {
            console.log(response)
                this.customers=response.data;
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
    this.fetchProducts();
}
}
</script>

<style>

</style>
