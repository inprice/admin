<template>
  <div>
    <div class="display-1">
      Import Product
    </div>

    <p class="subtitle mt-4 mb-8">
      Upload URL list of Amazon, Ebay and other known websites.
    </p>

    <div class="text-center">
      <v-menu
        open-on-hover
        offset-y
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            Import
          </v-btn>
        </template>

        <v-list>
          <v-list-item link :to="{name: 'import-csv' }">
            <v-list-item-content>
              <v-list-item-title>CSV Import</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-url'}">
            <v-list-item-content>
              <v-list-item-title>URL List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-ebay-sku'}">
            <v-list-item-content>
              <v-list-item-title>Ebay's SKU List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-amazon-asin'}">
            <v-list-item-content>
              <v-list-item-title>Amazon's ASIN List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  
    <div v-if="rows.length">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Created At</th>
              <th class="text-center">Type</th>
              <th class="text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td class="text-center">{{ row.createdAt }}</td>
              <td class="text-center">{{ row.type }}</td>
              <td class="text-center">
                <v-btn small>
                  Details
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

  </div>
</template>

<script>
import ImportService from '@/service/imbort';

export default {
  data() {
    return {
      rows: []
    }
  },
  mounted() {
    ImportService.list()
      .then((res) => {
        if (res && res.data) this.rows = res.data;
      });
  },
};
</script>