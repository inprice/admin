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
          <li>Each row must have a valid ASIN code starting either <strong>B0</strong> or <strong>BT</strong></li>
          <li>Each ASIN code must consist of 8 alpha numeric chars</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>A valid ASIN list</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
B00LH3DTYA
B005GIQPCU
BT0L2OMPNK
BT0178MP0K
</pre>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>Another valid ASIN list with description and empty lines</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
# -----------------------------------------
# ASIN CODE LIST
# -----------------------------------------
B00LH3DTYA
B005GIQPCU
# -----------------------------------------
# here is another description line
# -----------------------------------------
BT0L2OMPNK
BT0178MP0K
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