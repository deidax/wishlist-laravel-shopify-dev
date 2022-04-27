export default {
    namespaced: true,

    state: {
        globalStats: [],
    },

    getters: {
        getGlobalStats(state) {
            return state.globalStats;
        },
    },

    mutations: {
        globalStats(state,data) {
          return state.globalStats = data
        }
    },

    actions: {
        allStats(context) {
            return axios.get("/api/v1/dashboard")
                .then((response) => {
                    context.commit("globalStats", response.data);
                });
        },
    },
};
