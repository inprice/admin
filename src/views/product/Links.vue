<template>
  <div>

    <div class="headline mt-4 mb-2">
      Product
    </div>

    <v-card v-if="product">
      <v-card-title>
        {{ product.name }} 
        <v-spacer></v-spacer>
        <span class="font-weight-light"><strong>#</strong>{{ product.code }}</span>
      </v-card-title>

      <v-divider />

      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
            <tr>
              <th>Your Price</th>
              <td>{{ product.price | toCurrency }}</td>
              <th>Min Price</th>
              <td>{{ product.minPrice | toCurrency }}</td>
              <th>Max Price</th>
              <td>{{ product.maxPrice | toCurrency }}</td>
            </tr>

            <tr>
              <th>Your Position</th>
              <td>{{ product.position | toPosition }}</td>
              <th>Min Seller</th>
              <td>{{ product.minSeller }}</td>
              <th>Max Seller</th>
              <td>{{ product.maxSeller }}</td>
            </tr>

            <tr>
              <th>Avg Price</th>
              <td>{{ product.avgPrice | toCurrency }}</td>
              <th>Min Platform</th>
              <td>{{ product.minPlatform }}</td>
              <th>Max Platform</th>
              <td>{{ product.maxPlatform }}</td>
            </tr>

          </tbody>
        </template>
      </v-simple-table>

    </v-card>

    <v-divider></v-divider>

    <v-row class="mt-5">
      <v-col>
        <span class="headline">
          Links
        </span>
      </v-col>
      <v-col class="text-right">
        <v-btn dark color="success" @click="addNew">Add New Link</v-btn>
      </v-col>
    </v-row>

    <div v-if="rows && rows.length > 0">

      <v-card v-for="row in rows" :key="row.id" class="py-0 mb-4">
        <v-card-title class="py-2">{{ row.name || 'NA' }} </v-card-title>
        <v-card-subtitle class="py-1">Status: {{ row.status }}</v-card-subtitle>

        <v-simple-table dense class="ma-2 bordered">
          <template v-slot:default>
            <tbody>
              <tr>
                <th>Price</th>
                <td>{{ product.price | toCurrency }}</td>
                <th>Last Check</th>
                <td>{{ product.lastCheck || 'NA' }}</td>
              </tr>
              <tr>
                <th>Seller</th>
                <td>{{ row.seller || 'NA' }}</td>
                <th>Last Update</th>
                <td>{{ product.lastUpdate || 'NA' }}</td>
              </tr>
              <tr>
                <th>Platform</th>
                <td>{{ row.platform || 'NA' }}</td>
                <th>Shipment</th>
                <td>{{ product.shipment || 'NA' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <span class="caption ml-3"><strong>URL</strong>: {{ row.url }}</span>

      </v-card>
    </div>

    <p v-else class="mt-5">
      No link found! You can add a new one.
    </p>

    <LinkEdit ref="editDialog" @saved="refreshLinks" />
    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      rows: [],
      product: {},
      prod_id: 0
    }
  },
  methods: {
    addNew() {
      this.$refs.editDialog.open(0, '', this.prod_id);
    },
    edit(id, url) {
      this.$refs.editDialog.open(id, url, this.prod_id);
    },
    remove(id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (name | 'Link')).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            this.refreshLinks();
          }
        }
      });
    },
    async refreshLinks() {
      if (this.prod_id) {
        const result = await LinkService.list(this.prod_id);
        if (result) {
          this.rows = result.links;
          this.product = result.product;
          return;
        }
      }
      this.rows = [];
      this.product = {};
    },
  },
  mounted() {
    Utility.doubleRaf(() => {
      const urlParts = window.location.pathname.split('/');
      if (urlParts && urlParts.length) {
        const id = urlParts[urlParts.length-1];
        if (!isNaN(+id)) {
          this.prod_id = id;
          this.refreshLinks();
        }
      }
    });
  },
  components: {
    LinkEdit: () => import('./LinkEdit'),
    confirm: () => import('@/component/Confirm.vue')
  }
};
</script>

<style scoped>
  .bordered {
    border: 1px solid lightblue;
  }
  th {
    width: 10%;
    background-color: #eee;
  }
  tr:hover {
    background: #fff !important;
  }
  .v-data-table td, .v-data-table th {
    padding: 0 8px;
  }
</style>
