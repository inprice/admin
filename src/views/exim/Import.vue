<template>
  <div class="mt-2">
    <div class="title">Upload definitions</div>

    <v-expansion-panels class="mt-3" v-model="selectedPanel" focusable>
      <v-expansion-panel dense>
        <v-expansion-panel-header>
          The rules
        </v-expansion-panel-header>
        <v-expansion-panel-content class="body-2">
          <v-divider></v-divider>
          <div class="mt-3">File related</div>
          <ul>
            <li>File format must be plain CSV. For detailed info, please refer to <a target="_blank" href="https://en.wikipedia.org/wiki/Comma-separated_values">Wikipedia page</a></li>
            <li>File size must be less than 1 megabyte</li>
            <li>A file can have 1000 rows at max. More will be ignored</li>
            <li>Do not place a header at any line since each line is accepted as a data row</li>
          </ul>

          <div class="mt-3">Row related</div>
          <ul>
            <li>Each row in a file must represents a record</li>
            <li>Each row must have the same number of columns as the other rows in file</li>
            <li>Empty and duplicate rows are skipped</li>
            <li>Previously added records are ignored too</li>
          </ul>

          <div class="mt-3">Column related</div>
          <ul>
            <li>A column is a value between two consecutive commas in the file content</li>
            <li>Column separator is comma,</li>
            <li>Column count in each row must be the same</li>
            <li>Do not use thousand separator in numerical columns</li>
            <li>Decimal separator is period. Not comma,</li>
            <li>Special characters like double or single quote will be character escaped</li>
            <li>If a column has comma in it like SO,NY, it must be enclosed by double quotes: "SO,NY"</li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Upload Products
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <product />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Upload Brands
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <simple-definitions entityName="brand" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Upload Categories
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <simple-definitions entityName="category" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPanel: 0
    };
  },
  components: {
    Product: () => import('./Product.vue'),
    SimpleDefinitions: () => import('./SimpleDefinitions.vue'),
  }
 }
</script>
