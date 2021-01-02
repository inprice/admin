<template>
  <div>

    <v-card>
      <v-card-title class="pt-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-format-columns</v-icon>
        <div>The rules each row in your content must match</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>Each row must have a valid ASIN code starting either <strong>B0</strong> or <strong>BT</strong></li>
          <li>Each ASIN code must consist of 8 alpha numeric chars</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="pt-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-emoticon-outline</v-icon>
        <div>Valid ASIN list</div>
      </v-card-title>

      <v-divider/>

      <v-card-text class="py-2">
        <div class="sample-data">
          <div>B00LH3DTYA</div>
          <div>B005GIQPCU</div>
          <div>BT0L2OMPNK</div>
          <div>BT0178MP0K</div>
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="pt-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-emoticon-outline</v-icon>
        <div>
          <div>Another one</div>
          <div class="caption">With description lines</div>
        </div>
      </v-card-title>

      <v-divider/>

      <v-card-text class="py-2">
        <div class="sample-data">
          <div># -------------------------</div>
          <div># ASIN CODE LIST</div>
          <div># -------------------------</div>
          <div>B00LH3DTYA</div>
          <div>B005GIQPCU</div>
          <div># -------------------------</div>
          <div># another description line</div>
          <div># -------------------------</div>
          <div>BT0L2OMPNK</div>
          <div>BT0178MP0K</div>
        </div>
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
    padding-bottom: 5px;
  }
  .v-card__text {
    padding-left: 5px;
  }
</style>