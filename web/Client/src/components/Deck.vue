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
        <h1>{{deck.name}}</h1>
        <b-row>
          <b-col>
            <h3>Mana</h3>
             <b-table-simple small>
               <b-tr>
                 <b-td>Indenity</b-td>
                 <b-td>
                    <ColorIndenity :identity="deck.identity" />
                 </b-td>
               </b-tr>
               <b-tr>
                 <b-td>Average</b-td>
                 <b-td>{{avgCMC}}</b-td>
               </b-tr>
               <b-tr>
                 <b-td>Curve</b-td>
                 <b-td></b-td>
               </b-tr>
             </b-table-simple>
             <trend
              :data="[0, 2, 5, 9, 5, 10, 3]"
              :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
              :height="100"
              auto-draw
              smooth />
            <b-table-simple small borderless>
              <b-tr class="text-center">
                <b-td>
                  <b-badge pill>0</b-badge>
                  <br />
                  <small>0</small>
                </b-td>
                <b-td>
                  <b-badge pill>1</b-badge>
                  <br />
                  <small>2</small>
                </b-td>
                <b-td>
                  <b-badge pill>2</b-badge>
                  <br />
                  <small>5</small>
                </b-td>
                <b-td>
                  <b-badge pill>3</b-badge>
                  <br />
                  <small>9</small>
                </b-td>
                <b-td>
                  <b-badge pill>4</b-badge>
                  <br />
                  <small>5</small>
                </b-td>
                <b-td>
                  <b-badge pill>5</b-badge>
                  <br />
                  <small>10</small>
                </b-td>
                <b-td>
                  <b-badge pill>6+</b-badge>
                  <br />
                  <small>3</small>
                </b-td>
              </b-tr>
             </b-table-simple>
          </b-col>
          <b-col>
            <h3>&nbsp;</h3>
            <b-table-simple small>
              <template v-for="(value, index) in manaSymbols">
                <b-tr v-bind:key="index">
                  <b-td>
                    <template v-for="(style, index) in value.styles">
                      <i v-bind:key="index" v-bind:class="style" class="ms-cost ms"></i>
                    </template>
                  </b-td>
                  <b-td>{{value.amount}}</b-td>
                </b-tr>
              </template>
            </b-table-simple>
          </b-col>
          <b-col>
            <h3>Types</h3>
            
            <b-table-simple small>
              <template v-for="(item) in cardTypes">
                <tr v-bind:key="item.name">
                  <td>
                    <b-badge variant="primary">{{item.name}}</b-badge>
                  </td>
                  <td>{{ item.count }}</td>
                </tr>
                <template v-for="(amount, id) in item.types">
                  <tr v-bind:key="id">
                    <td>
                      &nbsp; 
                      <b-badge>{{id}}</b-badge>
                    </td>
                    <td>{{amount}}</td>
                  </tr>
                </template>
              </template>
            </b-table-simple>
          </b-col>
        </b-row>
        <!--<b-img fluid src="https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/04/12125716/Singleton-Deck-Guide-Mana-Curve-MTG-Arena.jpg" />-->
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
import { _ } from "underscore";
import { mapState, mapGetters } from "vuex";
import { exportDeck, getCardTypes } from "@/utilities/deck"; // checkColor, countColorless
import ColorIndenity from "@/components/ColorIndenity.vue";

export default {
  name: "Deck",
  components: {
    ColorIndenity
  },
  data: function() {
    return {
      editing: false,
      extraTypes: false,
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
        return state.building.decks.find(item => item.id == this.$route.params.id);
      },
      isComamander(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(!deck) {
          return false;
        }

        return deck.type == "commander" || deck.type == "duel";
      },
      avgCMC(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(!deck) {
          return 0;
        }

        let total = deck.cards.map(item => item.card.cmc ? item.card.cmc : 0).reduce((acc, value) => acc + value, 0);
        return (total / deck.cards.length).toFixed(2);
      },
      manaSymbols(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(!deck) {
          return {};
        }
        
        let regx = /{(.*?)}/g;
        let groups = deck.cards
          .map(item => Array.from(item.card.mana_cost.matchAll(regx)).map(m => m[1]) )
          .map(symbols => _.countBy(symbols))
          .map(symbols => Object.keys(symbols)
            .map(key => symbols[key] > 1 ? _.times(symbols[key], function(n){ return n; })
            .reduce((total) => total += key, '') : key) );
        
        let collection = _.chain(groups)
         .flatten()
         .countBy()
         .map(function(value, key) { 
            let styles = [];
            if(key.includes('/')) {
              styles = ["ms-" + key.toLowerCase().split('/').join('')];
            } else {
              for (let i = 0; i < key.length; i++) {
                styles.push("ms-" + key[i].toLowerCase());
              }
            }
            return { 
              name: key,
              amount: value,
              styles: styles
            };
          })
         .sortBy('name')
         .value();

        return collection;
      },
      cardTypes(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(!deck) {
          return {};
        }

        let types = getCardTypes(deck, state.settings);
        return types;
      },
      deckLimit(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(!deck) {
          return 0;
        }

        if(deck.type == "commander" || deck.type == "duel") {
          return 1;
        } else {
          return 4;
        }
      },
      existmatedCost(state) {
        let deck = state.building.decks.find(item => item.id == this.$route.params.id);
        if(deck) {
          let cost = this.deck.cards
            .map(item => item.card.prices.usd ? parseFloat(item.card.prices.usd) : 0.0)
            .reduce((state, value) => state + value, 0);

          return cost.toFixed(2);
        } else {
          return "0.00";
        }
      }
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
      let data = exportDeck(this.deck);
      let url = `${window.location.host}/#/import/?d=${data}`;
      navigator.clipboard.writeText(url);
      let options = {
        title: "Success",
        autoHideDelay: 5000,
        appendToast: true,
        variant: 'success'
      };
      let msg = `Deck Code Copied to Clipboard`;
      this.$bvToast.toast(msg, options);
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