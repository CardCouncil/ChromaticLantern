<template>
  <b-container id="sets">
    <b-row>
      <b-col>
        <p>
          Select set types you wish you wish to Include your future searches.
        </p>
        <p>
          All cards that match the Excluded set types will be automaticly fitler
          out of the search results.
        </p>
        <b-form-group label="Set Types">
          <b-form-checkbox-group
            v-model="selected"
            :options="options"
            switches
            stacked/>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Sets",
  computed: {
    options: function() {
      return this.$store.getters.types;
    },
    selected: {
      get: function() {
        return this.$store.state.types;
      },
      set: function(values) {
        this.$store.commit("updateTypes", values);
      }
    }
  },
  mounted: function() {
    this.$store.dispatch("load");
  }
};
</script>
