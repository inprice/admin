<template>
  <div>

    <div class="d-flex justify-space-between">
      <div>
        <div class="title">Product Import</div>
        <div class="body-2">Import your product definitions as batch.</div>
      </div>

      <v-menu
        offset-y
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="$store.get('session/isViewer')"
            small
            v-bind="attrs"
            v-on="on"
            class="my-auto"
          >
            Select a Method
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item link :to="{name: 'import-csv-file' }">
            <v-list-item-content>
              <v-list-item-title>CSV File</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-csv-list' }">
            <v-list-item-content>
              <v-list-item-title>CSV List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link :to="{name: 'import-url-file'}">
            <v-list-item-content>
              <v-list-item-title>URL File</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-url-list' }">
            <v-list-item-content>
              <v-list-item-title>URL List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link :to="{name: 'import-ebay-file'}">
            <v-list-item-content>
              <v-list-item-title>Ebay SKU File</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-ebay-list' }">
            <v-list-item-content>
              <v-list-item-title>Ebay SKU List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link :to="{name: 'import-amazon-file'}">
            <v-list-item-content>
              <v-list-item-title>Amazon ASIN File</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{name: 'import-amazon-list' }">
            <v-list-item-content>
              <v-list-item-title>Amazon ASIN List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-menu>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-3" v-if="CURSTAT.isActive">
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
                <td class="text-center">{{ row.type }} {{ row.isFile ? 'File' : 'List' }}</td>
                <td class="text-center">{{ row.successCount }}</td>
                <td class="text-center">{{ row.problemCount }}</td>
                <td class="text-center">
                  <ago :date="row.createdAt" />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>

      <v-card v-else >
        <block-message :message="'No import found!'" />
      </v-card>
    </v-card>

    <v-card v-else class="mt-3">
      <block-message 
        :message="'You are not allowed to import new products until activate your account!'">

        <v-btn 
          small
          color="success"
          class="my-auto float-right"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>

      </block-message>
    </v-card>

  </div>
</template>

<script>
import ImportService from '@/service/imbort';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      rows: []
    }
  },
  created() {
    ImportService.getList()
      .then((res) => {
        if (res && res.data) this.rows = res.data;
      });
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
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