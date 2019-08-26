<template>
  <b-container id="decks">
    <b-row>
      <b-col>
        <b-form inline @submit="addDeck">
          <label class="sr-only" for="inline-form-input-name">Type</label>
          <b-form-select
            v-model="form.type"
            required
            class="mb-2 mr-sm-2 mb-sm-0"
            :value="null"
            :options="types"
          >
            <option slot="first" :value="null">Type...</option>
          </b-form-select>

          <label class="sr-only" for="inline-form-input-username">Name</label>
          <b-input
            v-model="form.name"
            required
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Name"
          />

          <b-button type="submit" variant="success">Add</b-button>
        </b-form>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <b-col>
        <b-table striped hover caption-top :items="decks" :fields="fields">
          <template slot="[type]" slot-scope="data">
            {{ types[data.value] }}
          </template>
          <template slot="[cards]" slot-scope="row">
            <b-badge>{{ row.item.cards.length }}</b-badge>
          </template>
          <template slot="[actions]" slot-scope="row">
            <b-button
              size="sm"
              class="mr-1"
              variant="primary"
              @click="buildDeck(row.item, row.index, $event.target)"
            >
              Build
            </b-button>
            <b-button
              size="sm"
              class="mr-1"
              variant="warning"
              @click="clearDeck(row.item, row.index, $event.target)"
            >
              Clear
            </b-button>
            <b-button
              size="sm"
              class="mr-1"
              variant="danger"
              @click="removeDeck(row.item, row.index, $event.target)"
            >
              Remove
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "Decks",
  data: function() {
    return {
      form: {
        type: null,
        name: ""
      },
      fields: [
        { key: "name", label: "Name", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "cards", label: "Cards" },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  computed: {
    ...mapState({
      decks: state => state.building.decks
    }),
    ...mapGetters({
      types: "deckTypes"
    })
  },
  methods: {
    addDeck(evt) {
      evt.preventDefault();
      this.$store.dispatch("addDeck", this.form);
      this.form.name = "";
      this.form.type = null;
    },
    clearDeck(item) {
      let data = { deck: item };
      this.$store.dispatch("clearDeck", data);
    },
    removeDeck(item) {
      let data = { deck: item };
      this.$store.dispatch("removeDeck", data);
    },
    buildDeck(item) {
      this.$router.push({ name: "building", params: { id: item.id } });
    }
  }
};
</script>
