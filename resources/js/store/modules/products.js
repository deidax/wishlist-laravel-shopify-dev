

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
    fetchProducts(context) {
      return new Promise((resolve, reject) => {
        // make the call
        // call setProducts mutation
        axios.get("/api/v1/products")
            .then((response) => {
                context.commit("setProducts", response.data.data);
                resolve()
        });
      })
    }
  }
}
