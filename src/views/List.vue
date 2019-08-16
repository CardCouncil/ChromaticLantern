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
                <small class="float-right">{{ group.set.released_at }}</small>
              </b-button>
            </b-card-header>
            <b-collapse
              :id="'accordion-' + group.set.code"
              accordion="sets-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-row>
                  <b-col>
                    <b-card-group columns>
                      <template v-for="card in group.cards">
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
                              class="d-print-none"
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
      return this.$store.getters.list;
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
