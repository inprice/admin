<template>
  <div class="mt-2">
    <div class="title">Upload definitions</div>

    <v-expansion-panels class="mt-3" focusable>
      <v-expansion-panel dense>
        <v-expansion-panel-header>
          The rules
        </v-expansion-panel-header>
        <v-expansion-panel-content class="body-2">
          <v-divider></v-divider>
          <div class="mt-3">File related</div>
          <ul>
            <li>File format must be CSV. For detailed info, please refer to <a target="_blank" href="https://en.wikipedia.org/wiki/Comma-separated_values">Wikipedia page</a></li>
            <li>File size must be less than 1 megabyte</li>
            <li>A file can have 100 rows at max. More will be ignored</li>
            <li>Do not place a header line since first line will be accepted as a data row</li>
          </ul>

          <div class="mt-3">Row related</div>
          <ul>
            <li>Each row in content can have only one record</li>
            <li>Empty rows are skipped</li>
            <li>Duplicate rows are ignored</li>
            <li>Previously added records are ignored</li>
          </ul>

          <div class="mt-3">Field related</div>
          <ul>
            <li>Field separator is comma,</li>
            <li>Field count in each row must be the same</li>
            <li>Do not use thousand separator in numerical fields</li>
            <li>Decimal separator is period. Not comma,</li>
            <li>Special characters like double or single quote will be character escaped</li>
            <li>If a field has comma like SO,NY, it must be enclosed by double quotes: "SO,NY"</li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Brand
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <simple-definitions entityName="brand" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Category
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
  components: {
    SimpleDefinitions: () => import('./SimpleDefinitions.vue'),
  }
 }
</script>
