import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import setTypes from "@/assets/set-types.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    promo: [],
    sets: [],
    types: [],
    deck: [],
    groups: {}
  },
  getters: {
    // eslint-disable-next-line
    types: state => {
      return setTypes;
    },
    list: state => {
      // let types = state.types;
      // let hasFilter = types.length > 0;

      let list = [];

      for (const set of state.sets) {
        var item = state.groups[set.code];
        if (item.cards.length > 0) {
          /*
          if(hasFilter == true) {
            item.cards = item.cards.filter(_ => types.includes(_.set_type));
          }
          */
          list.push(item);
        }
      }
      list.sort((lhs, rhs) => {
        return new Date(lhs.set.released_at) - new Date(rhs.set.released_at);
      });
      return list;
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
    promo(state, data) {
      state.promo = data;
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
    },
    addCards(state, cards) {
      for (const card of cards) {
        state.groups[card.set].cards.push(card);
      }
    },
    removeCard(state, id) {
      state.deck = state.deck.filter(_ => _.id != id);
    },
    removeCards(state, name) {
      for (const set of state.sets) {
        var item = state.groups[set.code];
        item.cards = item.cards.filter(_ => _.name != name);
      }
    },
    updateTypes(state, types) {
      state.types = types;
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
      const api =
        "https://api.scryfall.com/cards/" + data.code + "/" + data.number;
      var card = await axios
        .get(api)
        .then(response => {
          return response.data;
        })
        .then(card => {
          return card;
        });

      var url = `https://api.scryfall.com/cards/search?q=!%20${card.name}%20&unique=prints`;
      var cards = await axios
        .get(url)
        .then(response => {
          return response.data.data;
        })
        .then(cards => {
          /*
          if (state.types.length > 0) {
            return cards.filter(_ => state.types.includes(_.set_type));
          } else {
            return cards;
          }
          */
          return cards;
        });

      commit("addCard", card);
      commit("addCards", cards);
    },
    removeCard({ commit }, data) {
      commit("removeCard", data.id);
      commit("removeCards", data.name);
    },
    clear({ commit }) {
      commit("clearDeck");
      commit("clearGroups");
    },
    promo({ commit, state }) {
      if (state.promo.length == 0) {
        const api =
          "https://api.scryfall.com/cards/search?q=Fireball&unique=prints&order=released&dir=asc";
        axios
          .get(api)
          .then(response => {
            return response.data.data;
          })
          .then(cards => {
            var urls = cards.map(_ => _.image_uris.small);
            commit("promo", urls);
          });
      }
    }
  }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  let store = {
    promo: state.promo,
    types: state.types,
    deck: state.deck,
    groups: state.groups
  };
  let item = JSON.stringify(store);
  localStorage.setItem("store", item);
});

export default store;
