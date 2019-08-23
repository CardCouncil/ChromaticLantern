<template>
  <b-container id="list">
    <b-row role="tablist">
      <b-col>
        <template v-for="group in groups">
          <b-card no-body class="mb-1" v-bind:key="group.set.code">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                variant="link"
                href="#"
                v-b-toggle="'accordion-' + group.set.code"
                style="line-height: 32px;"
              >
                <b-img
                  :src="group.set.icon_svg_uri"
                  class="float-left img-set"
                ></b-img>
                <span>{{ group.set.name }}</span>
                <small class="float-right"
                  ><b-badge>{{ group.cards.length }}</b-badge></small
                >
              </b-button>
            </b-card-header>
            <b-collapse
              :id="'accordion-' + group.set.code"
              accordion="sets-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-row>
                  <template v-for="card in group.cards">
                    <b-col
                      v-bind:key="card.id"
                      cols="12"
                      sm="12"
                      md="6"
                      lg="4"
                      xl="3"
                    >
                      <b-card
                        no-body
                        :img-src="card.image_uris.normal"
                        img-alt="Image"
                        img-top
                        class="p-1"
                      >
                        <b-card-body class="p-1 text-center">
                          <b-badge v-if="card.prices.usd"
                            >${{ card.prices.usd }}</b-badge
                          >
                          <b-button
                            @click="remove(card.id, card.name)"
                            class="d-print-none"
                            variant="link"
                            size="sm"
                            block
                            >Remove</b-button
                          >
                        </b-card-body>
                      </b-card>
                    </b-col>
                  </template>
                </b-row>
              </b-card-body>
            </b-collapse>
          </b-card>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "list",
  mounted: function() {
    this.$store.dispatch("load");
  },
  computed: {
    groups: function() {
      let sets = this.$store.state.sets;
      let groups = this.$store.state.groups;
      let types = this.$store.state.types;

      let list = [];
      for (const set of sets) {
        let item = groups[set.code];
        let collection = item.cards.slice();
        let cards =
          types.length > 0
            ? collection.filter(_ => types.includes(_.set_type))
            : collection;

        if (cards.length > 0) {
          cards.sort((lhs, rhs) => {
            return lhs.collector_number.localeCompare(rhs.collector_number);
          });
          let value = {
            cards: cards,
            set: item.set
          };
          list.push(value);
        }
      }
      list.sort((lhs, rhs) => {
        return new Date(lhs.set.released_at) - new Date(rhs.set.released_at);
      });
      return list;
    }
  },
  methods: {
    remove: function(id, name) {
      this.$store.dispatch("removeCard", { id, name });
    }
  }
};
</script>
<style scoped>
.img-set {
  width: 32px;
  height: 32px;
}
</style>
