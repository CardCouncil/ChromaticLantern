<template>
  <div class="shadow p-3 mb-4 bg-white rounded">
    <v-loading :active.sync="loading" :is-full-page="true" />
    <div>
      <b-row>
        <b-col>
          <h3>Search for Cards</h3>
        </b-col>
        <b-col>
          <div class="text-right">
            <b-button-group>
              <b-button @click="setType(0)">
                <v-icon name="edit" label="Simple" />
              </b-button>
              <b-button @click="setType(1)">
                <v-icon name="search" label="Advanced" />
              </b-button>
              <b-button @click="setType(2)">
                <v-icon name="upload" label="Import" />
              </b-button>
            </b-button-group>
          </div>
        </b-col>
      </b-row>
      <div v-if="search.type == 0">
        <b-row>
          <b-col>
            <b-form @submit="findSimple">
              <b-form-checkbox v-model="override" name="check-override" switch>
                Override Deck Constraints
              </b-form-checkbox>
              <b-input-group class="mt-3">
                <b-form-input v-model="search.simple" required placeholder="Card Name" />
                <b-input-group-append>
                  <b-button type="submit" variant="success">Search</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>
          </b-col>
        </b-row>
      </div>
      <div v-if="search.type == 1">
        <b-form @submit="findAdvanced">
          <p>Advanced Search Options coming soon...</p>
          <!-- 
            -we need name
            -we need text, i would like a word order matters check box
            -their type line search is actually kinda genius so i like it lol
            -colour needed - and its exactly or include or at most options
            -commander colour is needed depeneding on how we execute this
            -mana cost is weird, but i dont see why we would remove it
            -stats - this is useful in niche searches, like creatures with power/toughness 4+ or power 2 or less
            -formats - we could ditch this if we added the idea of selecting the type of deck you are making. but in a generic search maybe we would use it? hard to say. seems like a logical thing though
            -sets - i think we could make this into one nifty search bar instead of two
            -rariety - you dont use this but i do.
            criteria - i think we could drop this
            prices - maybe?
            artist/flavour/lore - drop
            language - drop
          -->
          <b-row>
            <b-col />
            <b-col>
              <b-button type="submit" variant="success" disabled>Search</b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
      <div v-if="search.type == 2">
        <b-row>
          <b-col>
            <b-form @submit="blukImport">
              <b-form-textarea
                v-model="search.bluk"
                rows="5"
                required
                placeholder="List of Scryfall Urls"
              />
              <br />
              <div class="text-center">
                <b-button type="submit" variant="success">Import</b-button>
              </div>
            </b-form>
          </b-col>
        </b-row>
      </div>
    </div>

    <b-modal id="bv-modal-search-results" size="xl" title="Results" @ok="submitSelection">
      <div class="d-block text-center">
        <b-row
          v-bind:class="['model-body-scrollable', cards.length > 3 ? 'model-body-scrollable-lg' : 'model-body-scrollable-sm']"
        >
          <template v-for="card in cards">
            <b-col :key="card.id" cols="12" sm="12" md="6" lg="4" xl="3">
              <div class="container" @click="selected(card)">
                <v-icon
                  v-if="isSelected(card)"
                  name="check-square"
                  class="centered-element text-success"
                />
                <div v-if="card.image_uris">
                  <b-img :src="card.image_uris.normal" :title="card.name" fluid class="p-1" />
                </div>
                <div v-else>
                  <b-img
                    :src="card.card_faces[0].image_uris.normal"
                    :title="card.name"
                    fluid
                    class="p-1"
                  />
                </div>
              </div>
            </b-col>
          </template>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Search",
  props: {
    format: {
      type: String,
      default: ""
    },
    identity: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      loading: false,
      override: false,
      search: {
        type: 0,
        simple: "",
        bluk: "",
        advanced: {}
      },
      cards: [],
      selection: []
    };
  },
  methods: {
    setType(value) {
      this.search.type = value;
      this.reset();
    },
    findSimple(evt) {
      evt.preventDefault();
      this.loading = true;
      this.cards = [];
      this.selection = [];

      let name = encodeURIComponent(this.search.simple);
      let query = `name:"${name}"`;
      if(!this.override) {
        if (this.format) {
          query += ` format:${this.format}`;
        }
        if (this.identity.length > 0) {
          query += ` identity:${this.identity.join("")}`;
        }
      }

      let url = `https://api.scryfall.com/cards/search?q=${query}`;
      axios
        .get(url)
        .then(response => {
          return response.data.data;
        })
        .then(data => {
          this.loading = false;
          this.cards = data;

          if(data.length == 1) {
            this.selection.push(data[0].id);
            this.submitSelection();
          } else {
            this.$bvModal.show("bv-modal-search-results");
          }
        })
        // eslint-disable-next-line 
        .catch(err => {
          let msg = (this.override) ? 
            `No results found with the current query of '${this.search.simple}'.` :
            `No results found with the current format of '${this.format}', identity of '${this.identity.join()}' and query of '${this.search.simple}'.` ; 
          let options = { title: "Error", size: "lg", centered: true };
          this.$bvModal.msgBoxOk(msg, options);
          this.loading = false;
        });
    },
    findAdvanced(evt) {
      evt.preventDefault();
      console.log("Advanced", this.search.advanced);
    },
    blukImport(evt) {
      evt.preventDefault();

      let lines = this.search.bluk.split("\n").filter(_ => _ != "");
      let cards = [];
      for (const input of lines) {
        const url = new URL(input);
        const data = url.pathname.split("/");
        cards.push({ set: data[2], collector_number: data[3] });
      }

      this.$emit("selected", cards);
      this.reset();
    },
    isSelected(card) {
      return this.selection.includes(card.id);
    },
    selected(card) {
      if (this.selection.includes(card.id)) {
        this.selection = this.selection.filter(_ => _ != card.id);
      } else {
        this.selection.push(card.id);
      }
    },
    submitSelection() {
      let cards = this.cards
        .filter(_ => this.selection.includes(_.id))
        .map(_ => {
          return { set: _.set, collector_number: _.collector_number };
        });

      this.$emit("selected", cards);
      this.reset();
    },
    reset() {
      this.search.simple = "";
      this.search.bluk = "";
      this.search.advanced = {};
      this.cards = [];
      this.selection = [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.model-body-scrollable {
  overflow-y: scroll;
  height: 600px;
}
.model-body-scrollable-sm {
  height: 300px;
}
.model-body-scrollable-lg {
  height: 600px;
}
.container {
  position: relative;
}
.centered-element {
  height: 100px;
  width: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 50%;
  margin-top: -50px;
}
</style>
