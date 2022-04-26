import Vue from 'vue'
import { createInertiaApp, Head } from '@inertiajs/inertia-vue'
import { InertiaProgress } from '@inertiajs/progress'
import Layout from './Shared/Layout'

createInertiaApp({
  title: title => `${title} - My App`,
  resolve: async name => {
    let page = (await import(`./Pages/${name}`)).default;
    
    page.layout ??= Layout;

    return page;
  },
  setup({ el, App, props, plugin }) {
    Vue.use(plugin)
       .component("Head", Head)

    new Vue({
      render: h => h(App, props),
    }).$mount(el)
  },

});

InertiaProgress.init()