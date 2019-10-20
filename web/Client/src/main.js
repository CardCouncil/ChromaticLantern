import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Plugins
import "./plugins/bootstrap-vue";
import "./plugins/icons-vue";
import "./plugins/loading-vue";
import "./plugins/charting-vue"

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created: () => store.dispatch("load"),
  render: h => h(App)
}).$mount("#app");
