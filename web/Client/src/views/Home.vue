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
      link: "https://img.scryfall.com/cards/small/front/f/6/f6a86f5d-cfbf-4d8e-9f8e-0f8288907396.jpg?1562666336",
      links: [
        "https://img.scryfall.com/cards/small/front/b/7/b7623c00-144b-4a8f-9c6c-f5e9e4f65ece.jpg?1559591696",
        "https://img.scryfall.com/cards/small/front/a/2/a285ab2e-836e-45b0-894e-574f733cf3db.jpg?1559591803",
        "https://img.scryfall.com/cards/small/front/3/9/39e05c2d-b4a1-4f59-8743-f1694c803164.jpg?1559592184",
        "https://img.scryfall.com/cards/small/front/d/a/dafb512f-536f-4f96-8440-03f1d20d8a5a.jpg?1559597131",
        "https://img.scryfall.com/cards/small/front/f/e/fed10840-6b11-458f-a554-ea865a76b3d8.jpg?1539999012",
        "https://img.scryfall.com/cards/small/front/5/f/5f96e816-206b-4fd7-a7d7-2d90542cf30a.jpg?1559592840",
        "https://img.scryfall.com/cards/small/front/a/f/afe078d7-cdde-44bb-942e-417123ebeccb.jpg?1559603642",
        "https://img.scryfall.com/cards/small/front/5/1/51a242c2-58bf-457b-b5ad-83e85b08ddd1.jpg?1557432092",
        "https://img.scryfall.com/cards/small/front/5/a/5a450153-45b5-4aea-aa27-8ffe6301e8b6.jpg?1562911699",
        "https://img.scryfall.com/cards/small/front/8/4/8401bb3d-d7b9-40cb-8e6a-4b0bfd7c0bd6.jpg?1559593183",
        "https://img.scryfall.com/cards/small/front/3/3/33e95953-0bd1-4bfc-b9e8-58cee092871a.jpg?1561756895",
        "https://img.scryfall.com/cards/small/front/7/d/7dc76703-7934-4817-92e8-8aee3e69266d.jpg?1559593518",
        "https://img.scryfall.com/cards/small/front/a/d/ad457b10-6e00-411f-b827-ff844f9b300d.jpg?1562593274",
        "https://img.scryfall.com/cards/small/front/5/c/5c9bd96c-e462-4716-a352-212db64a6de5.jpg?1562484799",
        "https://img.scryfall.com/cards/small/front/3/e/3ea1a073-698a-4d91-81fd-b2c7f5c0da00.jpg?1562908013",
        "https://img.scryfall.com/cards/small/front/9/6/967465c4-619a-4407-bffc-ffadb89726cd.jpg?1562638273",
        "https://img.scryfall.com/cards/small/front/7/c/7c11fcd9-abad-47c8-ae47-55750bc1c9de.jpg?1561757452",
        "https://img.scryfall.com/cards/small/front/4/7/47883c95-5822-4893-b0ae-fc540a28a0c1.jpg?1562843829",
        "https://img.scryfall.com/cards/small/front/1/d/1dc84106-aec3-4e52-8dcb-1ed545bf3058.jpg?1561973117",
        "https://img.scryfall.com/cards/small/front/c/4/c463b755-cdb9-49c5-a458-50ec1fac8b3c.jpg?1562936521",
        "https://img.scryfall.com/cards/small/front/b/3/b34d3714-f629-4066-8eaa-08817ad01cbb.jpg?1562472142",
        "https://img.scryfall.com/cards/small/front/e/6/e634d8f0-c150-402e-ab69-c2cb54eebb44.jpg?1562943554",
        "https://img.scryfall.com/cards/small/front/3/6/36389ad6-9bc2-442c-b94d-356887eeb91f.jpg?1562907725",
        "https://img.scryfall.com/cards/small/front/f/6/f6a86f5d-cfbf-4d8e-9f8e-0f8288907396.jpg?1562666336",
        "https://img.scryfall.com/cards/small/front/1/0/10544646-50d5-4225-a35f-e8396850fc0b.jpg?1562542980",
        "https://img.scryfall.com/cards/small/front/4/7/4781099d-4ccc-4133-803e-bbd730395b8f.jpg?1562909890",
        "https://img.scryfall.com/cards/small/front/d/c/dcbdc3be-f187-4fb2-9506-06d5abc37785.jpg?1562378491",
        "https://img.scryfall.com/cards/small/front/1/9/195573be-2188-4526-8daf-13e871f24a21.jpg?1562543167",
        "https://img.scryfall.com/cards/small/front/7/2/7220aaa0-c457-4067-b1ff-360b161c34e5.jpg?1562850134",
      ]
    };
  }
};
</script>
