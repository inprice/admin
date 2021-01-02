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
          <li>Each row must have a valid SKU code starting with <strong>1, 2, </strong> or <strong>3</strong></li>
          <li>Each SKU code must consist of 11 or 12 digits</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="pt-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-emoticon-outline</v-icon>
        <div>Valid SKU list</div>
      </v-card-title>

      <v-divider/>

      <v-card-text class="py-2">
        <div class="sample-data">
          <div>183767351247</div>
          <div>16034214202</div>
          <div>26363095820</div>
          <div>191732626551</div>
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
          <div># SKU CODE LIST</div>
          <div># -------------------------</div>
          <div>183767351247</div>
          <div>16034214202</div>
          <div># -------------------------</div>
          <div># another description line</div>
          <div># -------------------------</div>
          <div>26363095820</div>
          <div>191732626551</div>
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