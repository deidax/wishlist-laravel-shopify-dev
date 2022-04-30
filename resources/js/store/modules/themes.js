

export default {
  namespaced: true,

  state: {
    themes: []
  },

  getters: {
     getThemes(state) {
        return state.themes;
     }
  },

  mutations: {
    setThemes (state, themes) {
      // update themes
      state.themes = themes
    },
  },

  actions: {
    fetchThemes(context) {
      return new Promise((resolve, reject) => {
        // make the call
        // call setCustomers mutation
        axios.get("/api/v1/get-store-themes")
            .then((response) => {
                context.commit("setThemes", response.data);
                resolve()
        });
      })
    }
  }
}
