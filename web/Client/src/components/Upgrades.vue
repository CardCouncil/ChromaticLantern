<template>
  <b-modal
    :id="'bm-upgrades-' + data.id"
    size="xl"
    title="Upgrades"
    hide-footer
  >
    <div class="d-block text-center">
      <b-row v-if="data.upgrades.length > 0">
        <template v-for="card in data.upgrades">
          <b-col
            :key="card.id"
            cols="12"
            sm="12"
            md="6"
            lg="4"
            xl="3"
          >
            <b-card
              no-body
              :img-src="card.image_uris.normal"
              :img-alt="card.name"
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
                        variant="secondary"
                        size="sm"
                        title="Details"
                      >
                        <v-icon name="info-circle" />
                      </b-button>
                      <b-button 
                        variant="secondary" 
                        size="sm" 
                        title="Swap"
                        @click="select(card)"
                      >
                        <v-icon name="exchange-alt" />
                      </b-button>
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
            >Strictly Better</a>
            to suggest one.
          </p>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>
<script>

export default {
  name: "Upgrades",
  props: {
    data: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select(item) {
      this.show = false;

      let data = {
        original: this.data.card,
        replacement: item,
      }
      this.$emit('selected', data);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>