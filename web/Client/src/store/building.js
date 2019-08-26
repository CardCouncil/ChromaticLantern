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
    async addCard({ commit }, options) {
      let url = "";
      let decks = options.decks;
      let card = options.card;
      // Get Card Reprints
      let name = card.name.replace(/[^A-Za-z0-9]/g, "");
      let query = encodeURIComponent(name);
      url = `https://api.scryfall.com/cards/search?q=!"${query}"&unique=prints`;
      let reprints = await axios.get(url).then(response => {
        return response.data.data;
      });
      // GetCard Upgrades
      let upgrades = [];
      url = `/api/StrictlyBetter/Obsoletes/?name=${query}`;
      var obsoletes = await axios.get(url).then(response => {
        return response.data.data;
      });

      if (obsoletes.length > 0) {
        let body = [];
        for (const item of obsoletes) {
          body.push({ multiverse_id: item.superior.multiverseid });
        }
        url = `https://api.scryfall.com/cards/collection`;
        let replacements = await axios
          .post(url, { identifiers: body })
          .then(response => {
            return response.data.data;
          });
        for (const item of obsoletes) {
          let replacement = replacements.find(_ =>
            _.multiverse_ids.includes(item.superior.multiverseid)
          );
          if (replacement) {
            upgrades.push({
              id: item.id,
              votes: item.upvotes,
              labels: item.labels,
              card: replacement
            });
          }
        }

        upgrades.sort((lhs, rhs) => rhs.votes - lhs.votes);
      }

      for (const deck of decks) {
        var data = {
          deck: deck.id,
          card: card,
          reprints: reprints,
          upgrades: upgrades
        };
        commit("addCard", data);
      }
    },
    removeCard({ commit }, options) {
      var data = { deck: options.deck.id, card: options.card.id };
      commit("removeCard", data);
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
    addCard(state, data) {
      let deck = state.decks.find(_ => _.id == data.deck);
      deck.cards.add(data);
    },
    removeCard(state, data) {
      let deck = state.decks.find(_ => _.id == data.deck);
      deck.cards = deck.cards.filter(_ => _.id != data.card);
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
