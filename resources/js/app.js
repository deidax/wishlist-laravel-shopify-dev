require('./bootstrap');

window.Vue = require('vue').default;

//setting router
import VueRouter from 'vue-router'
import router from './routes'

Vue.use(VueRouter)

//setting axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

//Setting vue polaris
// import PolarisVue from '@hulkapps/polaris-vue';
// import '@hulkapps/polaris-vue/dist/polaris-vue.min.css';
// Vue.use(PolarisVue);

//Import navbar globally
// import navbar from "./layouts/navbar.vue"
// import footerhelp from "./layouts/footerhelp.vue"

const app = new Vue({
    el: '#app',
    router,
    components: { navbar,footerhelp }
});