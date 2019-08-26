<template>
  <b-container id="building">
    <div v-if="deck">
      <b-row>
        <b-col>
          <h1>{{ deck.name }}</h1>
        </b-col>
        <b-col>
          <h2 class="text-right">
            <b-badge>{{ getType(deck.type) }}</b-badge>
          </h2>
        </b-col>
      </b-row>
      <hr />
      <search />
      <hr />
      <b-row>
        <template v-for="card in deck.cards">
          <b-col v-bind:key="card.id" cols="12" sm="12" md="6" lg="4" xl="3">
            <b-card
              no-body
              :img-src="card.image_uris.normal"
              img-alt="Image"
              img-top
              class="p-1"
            >
              <b-card-body class="p-1">
                <b-row>
                  <b-col class="text-center">
                    <b-button-group size="sm">
                      <b-button
                        :href="card.scryfall_uri"
                        target="_blank"
                        variant="link"
                        size="sm"
                      >
                        Details
                      </b-button>
                      <b-button
                        v-if="card.upgrades.length > 0"
                        variant="link"
                        size="sm"
                        @click="upgrade(card.upgrades)"
                      >
                        Upgrade
                      </b-button>
                      <b-button
                        variant="link"
                        size="sm"
                        @click="remove(card.name)"
                      >
                        Remove
                      </b-button>
                    </b-button-group>
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

export default {
  name: "building",
  components: {
    Search
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapState({
      deck(state) {
        return state.building.decks.find(_ => _.id == this.$route.params.id);
      }
    }),
    ...mapGetters({
      types: "deckTypes"
    }),
    ...{
      // add other computed properties here...
    }
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {}
  },
  methods: {
    getType(type) {
      return this.types[type];
    }
  }
};
</script>
