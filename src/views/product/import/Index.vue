<template>
  <div>

    <div class="display-1">
      Import Product
    </div>

    <div class="d-flex justify-space-between mt-3">
      <div class="subtitle mt-2 mb-6">
        Upload URL list of Amazon, Ebay and other known websites.
      </div>

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
              Select a Method
            </v-btn>
          </template>

          <v-list>
            <v-list-item link :to="{name: 'import-csv-file' }">
              <v-list-item-content>
                <v-list-item-title>CSV File</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'import-url-file'}">
              <v-list-item-content>
                <v-list-item-title>URL File</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'import-ebay-file'}">
              <v-list-item-content>
                <v-list-item-title>Ebay's SKU File</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'import-amazon-file'}">
              <v-list-item-content>
                <v-list-item-title>Amazon's ASIN File</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>


    <div v-if="rows.length">
      <v-divider></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Type</th>
              <th class="text-center">Successes</th>
              <th class="text-center">Fails</th>
              <th class="text-center">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id" link @click="$router.push({name: 'import-details', params: { id: row.id}})">
              <td class="text-center">{{ row.type }}</td>
              <td class="text-center">{{ row.successCount }}</td>
              <td class="text-center">{{ row.problemCount }}</td>
              <td class="text-center">{{ row.createdAt }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div v-else class="ml-2 py-3">
      Previously upload not found!
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
    ImportService.getList()
      .then((res) => {
        if (res && res.data) this.rows = res.data;
      });
  },
};
</script>

<style scoped>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>