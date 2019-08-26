<template>
  <div class="search">
    <div>
      <b-row>
        <b-col>
          <h3>Search for Cards</h3>
        </b-col>
        <b-col>
          <div class="text-right">
            <b-button v-if="advanced" variant="primary" @click="toggle">Simple</b-button>
            <b-button v-else variant="primary" @click="toggle">Advanced</b-button>
          </div>
        </b-col>
      </b-row>
      <div v-if="advanced">
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
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <b-form inline @submit="search">
              <b-input
                v-model="form.name"
                required
                class="mb-2 mr-sm-2 mb-sm-0"
                placeholder="Card Name"
              />
              <b-button type="submit" variant="success">Search</b-button>
            </b-form>
          </b-col>
        </b-row>
      </div>
    </div>
    <div>
      <b-row>
        <b-col />
      </b-row>
    </div>
  </div>
</template>

<script>
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
      advanced: false,
      form: {
        name: "",
        url: ""
      }
    };
  },
  methods: {
    toggle() {
      this.advanced = !this.advanced;
    },
    search(evt) {
      evt.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
