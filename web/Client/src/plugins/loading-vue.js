import Vue from 'vue';
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

// Init plugin
Vue.component('v-loading', Loading);

// Init plugin
Vue.use(Loading);