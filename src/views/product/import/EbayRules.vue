<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-format-columns</v-icon>
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
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>A valid SKU list</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
183767351247
16034214202
26363095820
191732626551
</pre>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>Another valid SKU list with description and empty lines</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
# -----------------------------------------
# SKU CODE LIST
# -----------------------------------------
183767351247
16034214202
# -----------------------------------------
# here is another description line
# -----------------------------------------
26363095820
191732626551
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
    margin-top: 20px;
  }
  .v-card__title {
    padding-bottom: 10px;
  }
  .v-card__text {
    padding-left: 10px;
  }
</style>