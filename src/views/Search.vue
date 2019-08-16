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
            <b-link @click="toggle">Bluck</b-link>
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
      <b-col>
        <b-card-group columns>
          <template v-for="card in deck">
            <b-card
              v-bind:key="card.id"
              no-body
              :img-src="card.image_uris.normal"
              img-alt="Image"
              img-top
              class="p-1"
            >
              <b-card-body class="p-1">
                <b-button
                  @click="remove(card.id, card.name)"
                  variant="secondary"
                  size="sm"
                  block
                  >Remove</b-button
                >
              </b-card-body>
            </b-card>
          </template>
        </b-card-group>
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
    <b-modal id="bv-modal-example" static hide-header hide-footer>
      <div class="d-block text-center">
        <h4>Loading Cards</h4>
        <p>Please Wait...</p>
        <div class="text-center">
          <b-spinner label="Spinning"></b-spinner>
          <b-spinner type="grow" label="Spinning"></b-spinner>
          <b-spinner variant="primary" label="Spinning"></b-spinner>
          <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
          <b-spinner variant="success" label="Spinning"></b-spinner>
          <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
        </div>
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
  return new Promise((resolve,reject)=>{
    setTimeout(function() {
      resolve();
    }, seconds * 1000);
  });
}

export default {
  name: "search",
  data: function() {
    return {
      input: "",
      more: false,
      collection: ""
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
    remove: function(id, name) {
      this.$store.dispatch("removeCard", { id, name });
    },
    clear: function() {
      this.$store.dispatch("clear");
    },
    toggle: function() {
      this.input = "";
      this.collection = "";
      this.more = !this.more;
      this.$bvModal.hide("bv-modal-example");
    },
    bluck: async function() {
      this.$bvModal.show("bv-modal-example");
      let lines = this.collection.split("\n").filter(_ => _ != "");
      for (const input of lines) {
        let data = decodeUrl(input);
        this.$store.dispatch("addCard", data);
        await timer(0.5);
      }
      this.toggle();
      this.$bvModal.hide("bv-modal-example");
    }
  }
};
</script>
