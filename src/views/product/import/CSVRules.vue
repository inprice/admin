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
          <li>Comma char can only for separating columns. Please do not use in name or code column</li>
          <li>Code column can not be empty or duplicate</li>
          <li>Do not use thousand separator for price column</li>
          <li>Decimal point in price column must be a dot but not comma</li>
          <li>Price column must be greater than zero</li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-table-column</v-icon>
        <div>Column rules</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <ol>
          <li>The column count must be 3 and ordered as follows
            <div class="font-italic ml-4">Code, Name, Price</div>
          </li>
        </ol>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>A valid CSV content</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,19.99
0002,FISH KNIFE AND FORK 12 PIECES,30.50
0003,MASTERCHIEF GOURMET ROBOT,1199.99
</pre>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-emoticon-outline</v-icon>
        <div>Another valid CSV content with description and empty lines</div>
      </v-card-title>

      <v-divider/>

      <v-card-text>
<pre>
# CODE, NAME, PRICE
0001,12-PIECE STAMPED STAINLESS-STEEL CUTLERY SET,19.99

0002,FISH KNIFE AND FORK 12 PIECES,30.50
0003,MASTERCHIEF GOURMET ROBOT,1199.99
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