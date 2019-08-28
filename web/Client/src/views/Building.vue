<template>
  <b-container id="building">
    <v-loading :active.sync="loading" :is-full-page="true" />
    <Deck />
    <Search :format="deck.type" :identity="deck.identity" @selected="addCards"></Search>
    <div class="shadow p-3 mb-4 bg-white rounded">
      <b-row>
        <template v-for="item in cards">
          <b-col :key="item.id" cols="12" sm="12" md="6" lg="4" xl="3">
            <b-card
              overlay
              :img-src="item.card.image_uris.normal"
              img-alt="Image"
              img-top
              class="p-1 m-1 container">
              <v-icon
                v-if="isValidIndenity(item.card)"
                name="exclamation-triangle"
                class="centered-element text-warning"
              />
              <b-card-body class="p-1" style="position: absolute; top: 40px; left: -20px;">
                <b-row>
                  <b-col>
                    <b-button-group size="sm" vertical>
                      <b-button variant="secondary" @click="addCopy(item)">
                        <v-icon name="plus" />
                      </b-button>
                      <b-button :variant="`${isTargetMeet(item)}`">
                        <b-badge variant="light" >{{item.target}} / {{item.found}}</b-badge>
                      </b-button>
                      <b-button variant="secondary" @click="removeCopy(item)">
                        <v-icon name="minus" />
                      </b-button>
                      <b-button variant="link"></b-button>
                      <b-button
                        :href="item.card.scryfall_uri"
                        target="_blank"
                        variant="secondary"
                        title="Details">
                        <v-icon name="info-circle" />
                      </b-button>
                      <b-button
                        v-if="item.upgrades.length > 0"
                        variant="secondary"
                        title="Upgrade"
                        @click="$bvModal.show('bm-upgrades-' + item.id)">
                        <v-icon name="level-up-alt" />
                      </b-button>
                      <b-button 
                        v-if="canGeneral(item)"
                        variant="secondary" 
                        title="Prompt"
                        @click="prompt(item)">
                        <v-icon name="crown" />
                      </b-button>
                    </b-button-group>
                    
                    <Upgrades :data="item" @selected="swap" />
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </template>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { mapState } from "vuex";
import Deck from "@/components/Deck.vue";
import Search from "@/components/Search.vue";
import Upgrades from "@/components/Upgrades.vue";

export default {
  name: "Building",
  components: {
    Deck,
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
        let deck = state.building.decks.find(
          _ => _.id == this.$route.params.id
        );
        return deck ? deck.cards : [];
      },
      isComamander(state) {
        let deck = state.building.decks.find(_ => _.id == this.$route.params.id);
        if(deck) {
          return deck.type == "commander" || deck.type == "duel";
        } else {
          return false;
        }
      }
    })
  },
  methods: {
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
    swap(item) {
      this.loading = true;

      let data = {
        deck: this.deck.id,
        original: item.original.id,
        replacement: {
          set: item.replacement.set,
          collector_number: item.replacement.collector_number
        }
      };

      let self = this;
      this.$store.dispatch("swapCards", data).then(() => {
        self.loading = false;
      });
    },
    addCopy(item) {
      let data = {
        deck: this.deck.id,
        item: item.id
      };
      this.$store.dispatch("addCopy", data);
    },
    removeCopy(item) {
      let data = {
        deck: this.deck.id,
        item: item.id
      };

      if(item.target == 1) {
        let msg = "Are you sure you want to remove this card?";
        this.$bvModal.msgBoxConfirm(msg).then(value => {
          if(value) {
            this.$store.dispatch("removeCard", data);
          }
        });
      } else {
        this.$store.dispatch("removeCopy", data);
      }
    },
    isTargetMeet(item) {
      let limit = (this.isComamander) ? 1 : 4;
      return (item.found >= item.target) ? 'success' : (item.target > limit) ? 'warning' : 'primary';
    },
    isValidIndenity(card) {
      if(this.deck.identity.length > 0) {
        let results = card.color_identity
          .map(_ => this.deck.identity.includes(_))
          .reduce((state, value) => state && value, []);
        return !results;
      } else {
        return false;
      }
    },
    canGeneral(item) {
      let supported = ["commander", "duel"]
      if(supported.includes(this.deck.type)) {
        return item.card.type_line.includes("Legendary") && item.card.type_line.includes("Creature");
      } else{
        return false;
      }
    },
    async prompt(item) {
      let data = { ...this.deck };
      data.general = item.card.id;

      // Identity
      {
        let msg = 'Do you want to update the color identity to match the Commander?';
        let options = {
          title: 'Prompt Commander',
          size: "lg",
          okVariant: 'success',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        };
        let result = await this.$bvModal.msgBoxConfirm(msg, options).then(value => value);      
        if(result)  {
          data.identity = item.card.color_identity;
        }
      }

      // Identity
      {
        let msg = 'Do you want to rename the deck to match the Commander?';
        let options = {
          title: 'Prompt Commander',
          size: "lg",
          okVariant: 'success',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        };
        let result = await this.$bvModal.msgBoxConfirm(msg, options).then(value => value);      
        if(result)  {
          data.name = item.card.name;
        }
      }
      
      return this.$store.dispatch("editDeck", data);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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