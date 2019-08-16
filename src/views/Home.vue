<template>
  <b-container id="home">
    <div class="text-center">
      <h2>Chromatic Lantern</h2>
      <p>
        lights the way as it expands, sorts, and groups (by Set) a list cards
        you are searching for.
      </p>
      <h3>Take This...</h3>
      <b-img :src="link"></b-img>
      <h3>To This!</h3>
      <b-row>
        <template v-for="url in links">
          <b-col cols="2" v-bind:key="url">
            <b-img :src="url" fluid></b-img>
          </b-col>
        </template>
      </b-row>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "home",
  data: function() {
    return {
      link:
        "https://img.scryfall.com/cards/small/front/f/6/f6a86f5d-cfbf-4d8e-9f8e-0f8288907396.jpg?1562666336"
    };
  },
  mounted: function() {
    this.$store.dispatch("load");
    this.$store.dispatch("promo");
  },
  computed: {
    links: function() {
      return this.$store.state.promo;
    }
  }
};
</script>
