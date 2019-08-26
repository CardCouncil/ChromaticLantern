import BuildingModule from './store/building';
import SettingsModule from './store/settings';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({ storage: window.localStorage });

const store = new Vuex.Store({
  actions: {
    load({ dispatch }) {
      // Settings
      dispatch('loadSets');
      dispatch('loadTypes');
    }
  },
  modules: {
    settings: SettingsModule,
    building: BuildingModule
  },
  plugins: [vuexLocal.plugin]
});

export default store;
