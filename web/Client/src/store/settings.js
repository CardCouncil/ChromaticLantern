import axios from "axios";

const SettingsModule = {
  state: {
    sets: [],
    types: {
      creatures: [],
      walkers: [],
      lands: [],
      artifacts: [],
      enchantments: [],
      instants: [],
      sorceries: []
    }
  },
  actions: {
    loadSets({ commit }) {
      axios
        .get("https://api.scryfall.com/sets")
        .then(r => r.data.data)
        .then(data => {
          commit("loadSets", data);
        });
    },
    loadTypes({ commit }) {
      let requests = [
        axios
          .get("https://api.scryfall.com/catalog/creature-types")
          .then(r => r.data.data),
        axios
          .get("https://api.scryfall.com/catalog/planeswalker-types")
          .then(r => r.data.data),
        axios
          .get("https://api.scryfall.com/catalog/land-types")
          .then(r => r.data.data),
        axios
          .get("https://api.scryfall.com/catalog/artifact-types")
          .then(r => r.data.data),
        axios
          .get("https://api.scryfall.com/catalog/enchantment-types")
          .then(r => r.data.data),
        axios
          .get("https://api.scryfall.com/catalog/spell-types")
          .then(r => r.data.data)
      ];

      Promise.all(requests).then(function(data) {
        commit("loadTypes", data);
      });
    }
  },
  mutations: {
    loadSets(state, data) {
      state.sets = data;
    },
    loadTypes(state, data) {
      state.types.creatures = data[0];
      state.types.walkers = data[1];
      state.types.lands = data[2];
      state.types.artifacts = data[3];
      state.types.enchantments = data[4];
      state.types.instants = data[5];
      state.types.sorceries = data[5];
    }
  },
  getters: {}
};

export default SettingsModule;
