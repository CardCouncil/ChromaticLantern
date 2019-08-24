import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import setTypes from "@/assets/set-types.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    sets: [],
    types: [],
    deck: [],
    groups: {},
    upgrades: []
  },
  getters: {
    // eslint-disable-next-line
    types: state => {
      return setTypes;
    }
  },
  mutations: {
    loadStore(state) {
      var item = localStorage.getItem("store");
      if (item) {
        let store = JSON.parse(item);
        Object.assign(state, store);
        this.replaceState(state);
      }
    },
    loadSets(state, sets) {
      state.sets = sets;
    },
    loadGroups(state, groups) {
      state.groups = groups;
    },
    clearDeck(state) {
      state.deck = [];
    },
    clearGroups(state) {
      for (const set of state.sets) {
        state.groups[set.code].cards = [];
      }
    },
    addCard(state, card) {
      state.deck.push(card);
      state.deck.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));
    },
    addCards(state, cards) {
      for (const card of cards) {
        state.groups[card.set].cards.push(card);
      }
    },
    removeCard(state, name) {
      state.deck = state.deck.filter(_ => _.name != name);
      state.deck.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));
    },
    removeCards(state, name) {
      for (const set of state.sets) {
        var item = state.groups[set.code];
        item.cards = item.cards.filter(_ => _.name != name);
      }
    },
    updateTypes(state, types) {
      state.types = types;
    },
    loadUpgrades(state, cards) {
      state.upgrades = cards;
    }
  },
  actions: {
    load({ commit, state }) {
      commit("loadStore");

      const api = "https://api.scryfall.com/sets";
      axios
        .get(api)
        .then(response => {
          return response.data.data;
        })
        .then(sets => {
          var groups = state.groups;
          for (const set of sets) {
            if (!groups[set.code]) {
              groups[set.code] = {
                set: set,
                cards: []
              };
            }
          }

          commit("loadSets", sets);
          commit("loadGroups", groups);
        });
    },
    async addCard({ commit }, data) {
      let url = "";
      url = `https://api.scryfall.com/cards/${data.code}/${data.number}`;
      var card = await axios.get(url).then(response => {
        return response.data;
      });

      let name = card.name.replace(/[^A-Za-z0-9]/g, "");
      let query = encodeURIComponent(name);
      url = `https://api.scryfall.com/cards/search?q=!"${query}"&unique=prints`;
      var reprints = await axios.get(url).then(response => {
        return response.data.data;
      });

      url = `/api/StrictlyBetter/Obsoletes/?name=${query}`;
      var upgrades = await axios.get(url).then(response => {
        return response.data.data;
      });

      card.upgrades = [];
      for (const item of upgrades) {
        var api = `https://api.scryfall.com/cards/multiverse/${item.superior.multiverseid}`;
        var replacement = await axios.get(api).then(response => {
          return response.data;
        });

        card.upgrades.push({
          id: item.id,
          votes: item.upvotes,
          labels: item.labels,
          card: replacement,
          original: card.name
        });
      }

      card.upgrades.sort((lhs, rhs) => rhs.votes - lhs.votes); // desc

      commit("addCard", card);
      commit("addCards", reprints);
    },
    removeCard({ commit }, data) {
      commit("removeCard", data.name);
      commit("removeCards", data.name);
    },
    clear({ commit }) {
      commit("clearDeck");
      commit("clearGroups");
    },
    applyUpgrade({ commit, dispatch }, data) {
      commit("removeCard", data.original.name);
      commit("removeCards", data.original.name);
      dispatch("addCard", data.replacement);
    }
  }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  let store = {
    types: state.types,
    deck: state.deck,
    groups: state.groups
  };
  let item = JSON.stringify(store);
  localStorage.setItem("store", item);
});

export default store;
