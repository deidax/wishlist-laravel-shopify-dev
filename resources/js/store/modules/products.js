

export default {
  namespaced: true,

  state: {
    products: []
  },

  getters: {
     getProducts(state) {
            return state.products;
     }
  },

  mutations: {
    setProducts (state, products) {
      // update products
      state.products = products
    },
  },

  actions: {
      fetchProducts(context,params) {
            var link = "/api/v1/products"
          if (params) {
              link=link+"/DESC/"+params.number
          }
      return new Promise((resolve, reject) => {
        // make the call
        // call setProducts mutation
        axios.get(link)
            .then((response) => {
                context.commit("setProducts", response.data);
                resolve()
        });
      })
    }
  }
}
