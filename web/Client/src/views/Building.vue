<template>
  <b-container id="building">
    <v-loading
      :active.sync="loading"
      :is-full-page="true"
    />
    <div v-if="deck">
      <b-row>
        <b-col>
          <h1>{{ deck.name }}</h1>
        </b-col>
        <b-col>
          <h2 class="text-right">
            <b-badge variant="primary">
              {{ getType(deck.type) }}
            </b-badge>
          </h2>
        </b-col>
      </b-row>
      <hr>
      <search @selected="addCards" />
      <hr>
      <b-row>
        <template v-for="item in cards">
          <b-col
            :key="item.card.id"
            cols="12"
            sm="12"
            md="6"
            lg="4"
            xl="3"
          >
            <b-card
              no-body
              :img-src="item.card.image_uris.normal"
              img-alt="Image"
              img-top
              class="p-1 m-1"
            >
              <b-card-body class="p-1">
                <b-row>
                  <b-col class="text-center">
                    <b-button-group size="sm">
                      <b-button
                        :href="item.card.scryfall_uri"
                        target="_blank"
                        variant="secondary"
                        size="sm"
                        title="Details"
                      >
                        <v-icon name="info-circle" />
                      </b-button>
                      <b-button
                        v-if="item.upgrades.length > 0"
                        variant="secondary"
                        size="sm"
                        title="Upgrade"
                        @click="$bvModal.show('bm-upgrades-' + item.id)"
                      >
                        <v-icon name="level-up-alt" />
                      </b-button>
                      <b-button
                        variant="secondary"
                        size="sm"
                        title="Remove"
                        @click="remove(item)"
                      >
                        <v-icon name="times" />
                      </b-button>
                    </b-button-group>

                    <Upgrades
                      :data="item"
                      @selected="swap"
                    />
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </template>
      </b-row>
    </div>
    <div v-else>
      <span>Invalid Deck Id</span>
    </div>
  </b-container>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Search from "@/components/Search.vue";
import Upgrades from "@/components/Upgrades.vue";

export default {
  name: "Building",
  components: {
    Search,
    Upgrades
  },
  data: function() {
    return {
      loading: false,
      upgrades_show: false
    };
  },
  computed: {
    ...mapState({
      deck(state) {
        return state.building.decks.find(_ => _.id == this.$route.params.id);
      },
      cards(state) {
        let deck = state.building.decks.find(_ => _.id == this.$route.params.id);
        return (deck) ? deck.cards : [];
      }
    }),
    ...mapGetters({
      types: "deckTypes"
    }),
    ...{
      // 
    }
  },
  methods: {
    getType(type) {
      return this.types[type];
    },
    addCards(cards) {
      this.loading = true;

      let data = { 
        deck: this.deck.id,
        cards: cards
      };

      let self = this;
      this.$store.dispatch("addCards", data).then(() => {
        self.loading = false;
      });
    },
    upgrade(item) {
      this.upgrades_selection = item;
      this.upgrades_show = true;
    },
    remove(item) {
      let data = { 
        deck: this.deck.id,
        card: item.card.id
      };
      this.$store.dispatch("removeCard", data);
    },
    swap(item) {
      this.loading = true;
      
      let data = {
        deck: this.deck.id,
        original: item.original.id,
        replacement: {
          set: item.replacement.set,
          collector_number: item.replacement.collector_number,
        }
      }

      let self = this;
      this.$store.dispatch("swapCards", data).then(() => {
        self.loading = false;
      });
    }
  }
};
</script>
