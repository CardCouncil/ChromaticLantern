<template>
  <b-container id="search">
    <b-row>
      <b-col>
        <div v-if="more">
          <div class="text-center">
            <b-link @click="toggle">Single</b-link>
          </div>
          <b-input-group class="mt-3">
            <b-form-textarea v-model="collection" rows="5"></b-form-textarea>
          </b-input-group>
          <br />
          <div class="text-center">
            <b-button variant="outline-success" @click="bluck">Import</b-button>
          </div>
        </div>
        <div v-else>
          <b-input-group prepend="Scryfall Url" class="mt-3">
            <b-form-input v-model="input" v-on:keyup.enter="add"></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-success" @click="add">Add</b-button>
            </b-input-group-append>
          </b-input-group>
          <div class="text-center">
            <b-link @click="toggle">Bluk</b-link>
          </div>
        </div>
      </b-col>
    </b-row>
    <br />
    <b-row v-if="deck.length > 0">
      <b-col>
        <div class="text-center">
          <router-link to="/list">
            <b-button variant="success">
              List
            </b-button>
          </router-link>
          |
          <b-button @click="clear">Clear</b-button>
        </div>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <template v-for="card in deck">
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
                      >Details</b-button
                    >
                    <b-button
                      v-if="card.upgrades.length > 0"
                      @click="upgrade(card.upgrades)"
                      variant="link"
                      size="sm"
                      >Upgrade</b-button
                    >
                    <b-button
                      @click="remove(card.name)"
                      variant="link"
                      size="sm"
                      >Remove</b-button
                    >
                  </b-button-group>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </template>
    </b-row>
    <br />
    <b-row v-if="deck.length > 0">
      <b-col>
        <div class="text-center">
          <router-link to="/list">
            <b-button variant="success">
              List
            </b-button>
          </router-link>
          |
          <b-button @click="clear">Clear</b-button>
        </div>
      </b-col>
    </b-row>
    <br />
    <b-modal id="bv-modal-loading" static hide-header hide-footer>
      <div class="d-block text-center">
        <h4>Loading Cards</h4>
        <div class="text-center">
          <b-spinner label="Spinning"></b-spinner>
          <b-spinner type="grow" label="Spinning"></b-spinner>
          <b-spinner variant="primary" label="Spinning"></b-spinner>
          <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
          <b-spinner variant="success" label="Spinning"></b-spinner>
          <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
        </div>
        <p>Please Wait...</p>
      </div>
    </b-modal>
    <b-modal id="bv-modal-upgrades" size="lg" title="Upgrades" hide-footer>
      <div class="d-block text-center">
        <b-row v-if="upgrades.length > 0">
          <template v-for="item in upgrades">
            <b-col v-bind:key="item.id" cols="3">
              <b-card
                no-body
                :img-src="item.card.image_uris.normal"
                :img-alt="item.card.name"
                img-top
                class="p-1"
              >
                <b-card-body class="p-1">
                  <b-row>
                    <b-col cols="12">
                      <span v-if="item.labels.more_colors">
                        <img :src="require('@/assets/error.png')" /> More colors
                      </span>
                      <span v-else>&nbsp;</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="text-center">
                      <b-button-group size="sm">
                        <b-button
                          :href="item.card.scryfall_uri"
                          target="_blank"
                          variant="link"
                          size="sm"
                          >Details</b-button
                        >
                        <b-button @click="swap(item)" variant="link" size="sm"
                          >Swap</b-button
                        >
                      </b-button-group>
                    </b-col>
                  </b-row>
                </b-card-body>
              </b-card>
            </b-col>
          </template>
        </b-row>
        <b-row v-else>
          <b-col>
            <p>
              No matches found. Head over to
              <a
                href="https://www.strictlybetter.eu/card?name=Arvad%20the%20Cursed"
                target="_blank"
                >Strictly Better</a
              >
              to suggest one.
            </p>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </b-container>
</template>
<script>
function decodeUrl(input) {
  const url = new URL(input);
  const data = url.pathname.split("/");
  const code = data[2];
  const number = data[3];
  return { code, number };
}

function timer(seconds) {
  // eslint-disable-next-line
        return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, seconds * 1000);
  });
}

export default {
  name: "search",
  data: function() {
    return {
      more: false,
      input: "",
      collection: "",
      upgrades: []
    };
  },
  mounted: function() {
    this.$store.dispatch("load");
  },
  computed: {
    deck: function() {
      return this.$store.state.deck;
    }
  },
  methods: {
    add: function() {
      let data = decodeUrl(this.input);
      this.input = "";
      this.$store.dispatch("addCard", data);
    },
    remove: function(name) {
      this.$store.dispatch("removeCard", { name });
    },
    clear: function() {
      this.$store.dispatch("clear");
    },
    toggle: function() {
      this.input = "";
      this.collection = "";
      this.more = !this.more;
      this.$bvModal.hide("bv-modal-loading");
    },
    bluck: async function() {
      this.$bvModal.show("bv-modal-loading");
      let lines = this.collection.split("\n").filter(_ => _ != "");
      for (const input of lines) {
        let data = decodeUrl(input);
        this.$store.dispatch("addCard", data);
        await timer(0.5);
      }
      this.toggle();
    },
    upgrade: function(upgrades) {
      this.upgrades = upgrades;
      this.$bvModal.show("bv-modal-upgrades");
    },
    swap: function(item) {
      let data = {
        original: {
          name: item.original
        },
        replacement: {
          code: item.card.set,
          number: item.card.collector_number
        }
      };
      this.$store.dispatch("applyUpgrade", data);
      this.$bvModal.hide("bv-modal-upgrades");
    }
  }
};
</script>
