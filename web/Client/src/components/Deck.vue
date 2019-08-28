<template>
  <div v-if="deck" class="shadow p-3 mb-4 bg-white rounded">
    <b-row v-if="editing">
      <b-col>
        <b-form @submit="edit" @reset="cancel">
          <b-form-group label="Name" description>
            <b-form-input v-model="form.name" type="text" required></b-form-input>
          </b-form-group>
          <b-form-group label="Type" description>
            <b-form-select v-model="form.type" :options="types">
              <option slot="first" :value="null">Unknown</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="Color Identity" description>
            <b-form-checkbox-group v-model="form.identity">
              <b-form-checkbox value="W">White</b-form-checkbox>
              <b-form-checkbox value="U">Blue</b-form-checkbox>
              <b-form-checkbox value="B">Black</b-form-checkbox>
              <b-form-checkbox value="R">Red</b-form-checkbox>
              <b-form-checkbox value="G">Green</b-form-checkbox>
              <b-form-checkbox value="C">Colorless</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="success">Edit</b-button>	
          &nbsp;
          <b-button type="reset" variant="secondary">Cancel</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <h4>Deck Summary</h4>
        <b-table-simple small caption-top>
           <b-tbody>
              <b-tr>
                <b-td>Name</b-td>
                <b-td>{{ deck.name }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Type</b-td>
                <b-td>{{ getType(deck.type) }}</b-td>
              </b-tr>
              <b-tr v-if="deck.identity.length > 0">
                <b-td>Identity</b-td>
                <b-td>
                  <i v-if="deck.identity.includes('W')" class="ms-cost ms ms-w "></i>
                  <i v-if="deck.identity.includes('U')" class="ms-cost ms ms-u "></i>
                  <i v-if="deck.identity.includes('B')" class="ms-cost ms ms-b "></i>
                  <i v-if="deck.identity.includes('R')" class="ms-cost ms ms-r "></i>
                  <i v-if="deck.identity.includes('G')" class="ms-cost ms ms-g "></i>
                  <i v-if="deck.identity.includes('C')" class="ms-cost ms ms-c "></i>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>Cards</b-td>
                <b-td>{{ deck.cards.length }}</b-td>
              </b-tr>
              <b-tr>
                <b-td>Price (US)</b-td>
                <b-td>${{ totalCost }}</b-td>
              </b-tr>
           </b-tbody>
        </b-table-simple>
      </b-col>
      <b-col v-if="isComamander">
        <h4>Commander</h4>
        <b-img v-if="deck.general" :src="generalImage" fluid></b-img>
        <b-img v-else src="https://img.scryfall.com/errors/missing.jpg" width="146" height="204"></b-img>
      </b-col>
      <b-col>
        <h4>Mana</h4>
        <b-table-simple small caption-top>
          <b-thead>
            <b-tr>
              <b-th>
                <i class="ms-cost ms ms-w "></i>
              </b-th>
              <b-th>
                <i class="ms-cost ms ms-u "></i>
              </b-th>
              <b-th>
                <i class="ms-cost ms ms-b "></i>
              </b-th>
              <b-th>
                <i class="ms-cost ms ms-r "></i>
              </b-th>
              <b-th>
                <i class="ms-cost ms ms-g "></i>
              </b-th>
               <b-th>
                <i class="ms-cost ms ms-c "></i>
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>{{manaCountWhite}}</b-td>
              <b-td>{{manaCountBlue}}</b-td>
              <b-td>{{manaCountBlack}}</b-td>
              <b-td>{{manaCountRed}}</b-td>
              <b-td>{{manaCountGreen}}</b-td>
              <b-td>{{manaCountColorless}}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
      <b-col cols="1">
        <div class="text-right">
          <b-button-group vertical>
            <b-button variant="secondary" size="sm" title="Edit" @click="open" >
              <v-icon name="edit" />
            </b-button>
            <b-button variant="secondary" size="sm" title="Share" @click="share">
              <v-icon name="share-alt" />
            </b-button>
            <b-button variant="secondary" size="sm" title="Clear" @click="clear" >
              <v-icon name="eraser" />
            </b-button>
          </b-button-group>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

function checkColor(state, id, symbol) {
  let deck = state.building.decks.find(_ => _.id == id);
  if(deck) {
    let cost = deck.cards
      .map(_ => (_.card.mana_cost.match(symbol) || []).length)
      .reduce((state, value) => state + value, 0);
    return cost;
  } else {
    return 0;
  }
}

function countColorless(state, id) {
  let deck = state.building.decks.find(_ => _.id == id);
  if(deck) {
    let cost = deck.cards
      .map(_ => {
        let regx = /{(\d*?)}/g;
        let matches = regx.exec( _.card.mana_cost);
        return (matches) ? parseInt(matches[1]) : 0;
      })
      .reduce((state, value) => state + value, 0);
      
    return cost;
  } else {
    return 0;
  }
}

export default {
  name: "Deck",
  data: function() {
    return {
      editing: false,
      form: {
        name: "",
        type: null,
        identity: []
      }
    };
  },
  computed: {
    ...mapState({
      deck(state) {
        return state.building.decks.find(_ => _.id == this.$route.params.id);
      },
      isComamander(state) {
        let deck = state.building.decks.find(_ => _.id == this.$route.params.id);
        if(deck) {
          return deck.type == "commander" || deck.type == "duel";
        } else {
          return false;
        }
      },
      generalImage(state) {
        let deck = state.building.decks.find(_ => _.id == this.$route.params.id);
        return `https://api.scryfall.com/cards/${deck.general}?format=image&version=small`;
      },
      totalCost(state) {
        let deck = state.building.decks.find(_ => _.id == this.$route.params.id);
        if(deck) {
          let cost = this.deck.cards
            .map(_ => _.card.prices.usd ? parseFloat(_.card.prices.usd) : 0.0)
            .reduce((state, value) => state + value, 0);

          return cost.toFixed(2);
        } else {
          return "0.00";
        }
      },
      manaCountWhite(state) {
        return checkColor(state, this.$route.params.id, /{W}/g);
      },
      manaCountBlue(state) {
        return checkColor(state, this.$route.params.id, /{U}/g);
      },
      manaCountBlack(state) {
        return checkColor(state, this.$route.params.id, /{B}/g);
      },
      manaCountRed(state) {
        return checkColor(state, this.$route.params.id, /{R}/g);
      },
      manaCountGreen(state) {
        return checkColor(state, this.$route.params.id, /{G}/g);
      },
      manaCountColorless(state) {
        return countColorless(state, this.$route.params.id);
      },
    }),
    ...mapGetters({
      types: "deckTypes"
    })
  },
  methods: {
    open() {
      this.form.name = this.deck.name;
      this.form.type = this.deck.type;
      this.form.identity = this.deck.identity;
      this.editing = true;
    },
    getType(type) {
      return this.types[type];
    },
    edit(evt) {
      evt.preventDefault();
      this.editing = false;
      let data = {
        id: this.deck.id,
        name: this.form.name,
        type: this.form.type,
        identity: this.form.identity
      };
      this.$store.dispatch("editDeck", data);
    },
    clear() {
      let msg = "Are you sure you want to remove this card?";
      this.$bvModal.msgBoxConfirm(msg).then(value => {
        if(value) {
          let data = { deck: this.deck };
          this.$store.dispatch("clearDeck", data);
        }
      });
    },
    share() {
      // TODO: create deck code to share with others
      let msg = `Deck Code...`;
      let options = { title: "Share", size: "lg", centered: true };
      this.$bvModal.msgBoxOk(msg, options);
    },
    cancel(evt) {
      evt.preventDefault();
      this.editing = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>