import axios from "axios";
import shortid from "shortid";

const BuildingModule = {
  state: {
    decks: []
  },
  actions: {
    addDeck({ commit }, options) {
      let defaults = { id: shortid.generate(), cards: [] };
      let data = { ...defaults, ...options };
      commit("addDeck", data);
    },
    removeDeck({ commit }, options) {
      let data = { deck: options.deck.id };
      commit("removeDeck", data);
    },
    clearDeck({ commit }, options) {
      let data = { deck: options.deck.id };
      commit("clearDeck", data);
    },
    async addCards({ commit }, options) {
      let cards = [];

      for (const key of options.cards) {
        // Get Card 
        let cardUrl = `https://api.scryfall.com/cards/${key.set}/${key.collector_number}`;
        let card = await axios.get(cardUrl).then(response => response.data);

        // Get Card Reprints
        let query = `set:${key.set} number:${key.collector_number}`;
        let reprintsUrl = `https://api.scryfall.com/cards/search?q=${query}&unique=prints`;
        let reprints = await axios.get(reprintsUrl).then(response => response.data.data);

        // Get Card Upgrades
        let upgradeUrl = `/api/StrictlyBetter/Upgrades/?name=${card.name}`;
        var upgrades = await axios.get(upgradeUrl).then(response => {
          return (response.data) ? response.data.data : [];
        }).catch(response => {
          return [];
        });

        var item = {
          id: shortid.generate(),
          card: card,
          has_reprints: reprints.length > 0,
          reprints: reprints,
          has_upgrades: upgrades.length > 0,
          upgrades: upgrades
        };
        cards.push(item);
      }

      let data = {
        deck: options.deck,
        cards: cards,
      }

      commit("addCards", data);
    },
    removeCard({ commit }, options) {
      var data = { 
        deck: options.deck, 
        card: options.card 
      };
      commit("removeCard", data);
    },
    swapCards({ dispatch }, options) {
      let removeOptions = { 
        deck: options.deck, 
        card: options.original 
      };
      dispatch('removeCard', removeOptions);

      let addOptions = { 
        deck: options.deck,
        cards: [options.replacement]
      };
      dispatch('addCards', addOptions);
    }
  },
  mutations: {
    addDeck(state, data) {
      state.decks.push(data);
    },
    removeDeck(state, data) {
      state.decks = state.decks.filter(_ => _.id != data.deck);
    },
    clearDeck(state, data) {
      let deck = state.decks.find(_ => _.id == data.deck);
      deck.cards = [];
    },
    addCards(state, data) {
      let deck = state.decks.find(_ => _.id == data.deck);
      deck.cards = deck.cards.concat(data.cards);
      deck.cards.sort(function(lhs, rhs) { return lhs.card.collector_number - rhs.card.collector_number; });
    },
    removeCard(state, data) {
      let deck = state.decks.find(_ => _.id == data.deck);
      deck.cards = deck.cards.filter(_ => _.card.id != data.card);
      deck.cards.sort(function(lhs, rhs) { return lhs.card.collector_number - rhs.card.collector_number; });
    }
  },
  getters: {
    // eslint-disable-next-line
    deckTypes: state => { 
      return {
        commander: "Commander",
        duel: "Duel Commander",
        standard: "Standard",
        modern: "Modern",
        legacy: "Legacy",
        vintage: "Vintage",
        brawl: "Brawl"
      };
    }
  }
};

export default BuildingModule;
