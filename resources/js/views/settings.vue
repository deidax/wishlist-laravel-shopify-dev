<template>
  <div>
    <h1>settings</h1>
  {{themes}}
  </div>
</template>

<script>
export default {
data(){
    return{
        themes :[]
    }
},
methods:{
    fetchProducts(){
        axios.get("/api/v1/products/DESC/10").then((response) => {
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
    this.fetchProducts();
}
}
</script>

<style>

</style>
