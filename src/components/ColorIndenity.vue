<template>
  <div class="d-inline">
    <i v-if="identity.includes('W')" class="ms-cost ms ms-w "></i>
    <i v-if="identity.includes('U')" class="ms-cost ms ms-u "></i>
    <i v-if="identity.includes('B')" class="ms-cost ms ms-b "></i>
    <i v-if="identity.includes('R')" class="ms-cost ms ms-r "></i>
    <i v-if="identity.includes('G')" class="ms-cost ms ms-g "></i>
    <i v-if="identity.includes('C')" class="ms-cost ms ms-c "></i>
  </div>
</template>

<script>
export default {
  name: "ColorIndenity",
  props: {
    identity: {
      type: Array,
      default: () => []
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>