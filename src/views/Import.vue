<template>
  <b-container id="import">
    <v-loading :active="true" :is-full-page="true" />
  </b-container>
</template>
<script>
import { importDeck } from "@/utilities/deck";

export default {
  name: "Import",
  data: function() {
    return {};
  },
  mounted: async function() {
    // Decode Deck
    let code = this.$route.query.d;
    let data = importDeck(code);
    
    // Add Deck
    await this.$store.dispatch("addDeck", data.deck);

    // Add Cards
    let options = {
      deck: data.deck.id,
      cards: data.cards
    }
    await this.$store.dispatch("addCards", options);

    // GoTo deck building page
    await this.$router.push({ name: 'building', params: { id: data.deck.id } });
  }
};
</script>
<style scoped>
</style>
