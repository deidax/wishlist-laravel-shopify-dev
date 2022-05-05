export default {
    namespaced: true,

    state: {
        settings: [],
    },

    getters: {
        getSettings(state) {
            return state.settings;
        },
    },

    mutations: {
        setSettings(state,data) {
          return state.settings = data
        }
    },

    actions: {
        saveSettings(context,options) {
            return  axios.post("/api/v1/configure-theme", options).then((response) => {
                this.themes=response.data;
            })
        },
    },
};
