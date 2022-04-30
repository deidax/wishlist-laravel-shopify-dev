

export default {
  namespaced: true,

  state: {
    customers: []
  },

  getters: {
     getCustomers(state) {
        return state.customers;
     }
  },

  mutations: {
    setCustomers (state, customers) {
      // update customers
      state.customers = customers
    },
  },

  actions: {
    fetchCustomers(context) {
      return new Promise((resolve, reject) => {
        // make the call
        // call setCustomers mutation
        axios.get("/api/v1/customers")
            .then((response) => {
                context.commit("setCustomers", response.data);
                resolve()
        });
      })
    }
  }
}
