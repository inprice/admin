<template>
  <div>

    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-2">mdi-format-columns</v-icon>
        <div>The rules each row in your content must match</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>It must have a valid URL starting with <strong>http or https</strong></li>
          <li>It can be up to 1024 chars long</li>
          <li>It cannot be less than 10 chars.</li>
          <li>It must be the exact address of your competitor's product page.</li>
          <li>At least, Code, Name and Price fields should be displayed on the page it refers.</li>
          <li>The list should not contain duplicate rows</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>A valid URL list</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
https://www.amazon.com/AmazonBasics-High-Speed-HDMI-Cable-1-Pack/dp/B014I8T0YQ
https://www.ebay.com/itm/Xiaomi10-Pro-5G-12GB-256GB-12GB-512GB-Duel-Sim-Global-version-Google-store/133356161760
https://www.debenhams.com/webapp/wcs/stores/servlet/prod_10701_10001_123010030399_-1
https://www.zalando.co.uk/zign-polo-shirt-black-zi122p006-q11.html
https://www.mediamarkt.de/de/product/_samsung-galaxy-tab-a-10-1-wi-fi-2586325.html
</pre>
      </v-card-text>
    </v-card>

  </div>

</template>

<style scoped>
  ol {
    counter-reset: list;
  }
  ol > li {
    list-style: none;
  }
  ol > li:before {
    content: counter(list) ") ";
    counter-increment: list;
    font-weight: bold;
  }
  .v-card {
    margin-top: 15px;
  }
  .v-card__title {
    padding-bottom: 10px;
  }
  .v-card__text {
    padding-left: 10px;
  }
</style>