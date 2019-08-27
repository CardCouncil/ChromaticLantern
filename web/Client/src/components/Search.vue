<template>
  <div class="search">
    <v-loading
      :active.sync="loading"
      :is-full-page="true"
    />
    <div>
      <b-row>
        <b-col>
          <h3>Search for Cards</h3>
        </b-col>
        <b-col>
          <div class="text-right">
            <b-button-group>
              <b-button @click="setType(0)">
                <v-icon
                  name="edit"
                  label="Simple"
                />
              </b-button>
              <b-button @click="setType(1)">
                <v-icon
                  name="search"
                  label="Advanced"
                />
              </b-button>
              <b-button @click="setType(2)">
                <v-icon
                  name="upload"
                  label="Import"
                />
              </b-button>
            </b-button-group>
          </div>
        </b-col>
      </b-row>
      <br>
      <div v-if="search.type == 0">
        <b-row>
          <b-col>
            <b-form @submit="findSimple">
              <b-input-group class="mt-3">
                <b-form-input
                  v-model="search.simple"
                  required
                  placeholder="Card Name"
                />
                <b-input-group-append>
                  <b-button
                    type="submit"
                    variant="success"
                  >
                    Search
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>
          </b-col>
        </b-row>
      </div>
      <div v-if="search.type == 1">
        <b-form @submit="findAdvanced">
          <b-row>
            <b-col>
              <span>Colors and Color Identity</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Card Types</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Card Text</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Mana Costs</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Power, Toughness, and Loyalty</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Rarity</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Sets</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Format Legality</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Prices</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Year</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col>
              <span>Reprints</span>
            </b-col>
            <b-col />
          </b-row>
          <b-row>
            <b-col />
            <b-col>
              <b-button
                type="submit"
                variant="success"
              >
                Search
              </b-button>
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
              <br>
              <div class="text-center">
                <b-button
                  type="submit"
                  variant="success"
                >
                  Import
                </b-button>
              </div>
            </b-form>
          </b-col>
        </b-row>
      </div>
    </div>
    <b-modal
      id="bv-modal-search-results"
      size="xl"
      title="Results"
      @ok="submitSelection"
    >
      <div class="d-block text-center">
        <b-row class="model-body-scrollable">
          <template v-for="card in cards">
            <b-col
              :key="card.id"
              cols="12"
              sm="12"
              md="6"
              lg="4"
              xl="3"
            >
              <div
                class="container"
                @click="selected(card)"
              >
                <v-icon
                  v-if="isSelected(card)"
                  name="check-square"
                  class="centered-element text-success"
                />
                <div v-if="card.image_uris">
                  <b-img
                    :src="card.image_uris.normal"
                    :title="card.name"
                    fluid
                    class="p-1"
                  />
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
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      loading: false,
      search: {
        type: 0,
        simple: '',
        bluk: '',
        advanced : {},
      },
      cards: [],
      selection: [],
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

      let query = encodeURIComponent(this.search.simple);
      let url = `https://api.scryfall.com/cards/search?q="${query}"`;
      
      axios.get(url).then(response => {
        return response.data.data;
      }).then(data => {
        this.cards = data;
        this.loading = false;
        this.$bvModal.show("bv-modal-search-results");
      // eslint-disable-next-line no-unused-vars
      }).catch(err => {
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
      
      this.$emit('selected', cards);
      this.reset();
    },
    isSelected(card) {
      return this.selection.includes(card.id);
    },
    selected(card) {
      if(this.selection.includes(card.id)) {
        this.selection = this.selection.filter(_ => _ != card.id);
      } else {
        this.selection.push(card.id);
      }
    },
    submitSelection() {
      let cards = this.cards
        .filter(_ => this.selection.includes( _.id))
        .map(_ => { 
          return { set: _.set, collector_number: _.collector_number }; 
        });

      this.$emit('selected', cards);
      this.reset();
    },
    reset() {
      this.search.simple = '';
      this.search.bluk = '';
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
