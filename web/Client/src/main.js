import Vue from 'vue';
// Plugins
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created: () => store.dispatch('load'),
  render: h => h(App)
}).$mount('#app');
