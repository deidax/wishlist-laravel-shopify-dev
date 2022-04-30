

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
      fetchCustomers(context, params) {
          var link = "/api/v1/customers"
          if (params) {
              link=link+"/"+params.sortBy+"/"+params.orderBy+"/"+params.number
          }
      return new Promise((resolve, reject) => {
        // make the call
        // call setCustomers mutation
        axios.get(link)
            .then((response) => {
                context.commit("setCustomers", response.data);
                resolve()
        });
      })
    }
  }
}
