<template>
  <div>

    <div class="mt-4 mb-2" v-if="product">
      <v-row class="mx-2 mb-2">
        <div>
          <div class="headline">
            {{ product.name }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <span class="title text-right font-weight-light"><strong>#</strong>{{ product.code }}</span>
      </v-row>

      <v-divider></v-divider>

      <v-row class="mt-8 mb-3 mx-2">
        <span >
          Linkleri statulerine gore listelemek icin statu Combobox i gelecek
        </span>
        <v-spacer></v-spacer>
        <div class="text-right">
          <v-btn dark color="success" @click="addNew">Add New Link</v-btn>
        </div>
      </v-row>

      <div v-if="rows && rows.length > 0">

        <v-card v-for="row in rows" :key="row.id" class="py-0 mb-4 pb-1">
          <v-card-title class="pt-2 pb-1">
            {{ row.name || 'NA' }}
          
            <v-spacer></v-spacer>

            <v-menu offset-y left>
              <template v-slot:activator="{ on }">
                <v-btn x-small fab elevation="1" v-on="on">
                  <v-icon dark>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item @click="changeStatus(row.id, 'RENEW')" v-if="isSuitable(row.status, 'RENEWED')">
                  <v-list-item-title>RENEW</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeStatus(row.id, 'PAUSE')" v-if="isSuitable(row.status, 'PAUSED')">
                  <v-list-item-title>PAUSE</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeStatus(row.id, 'RESUME')" v-if="isSuitable(row.status, 'RESUMED')">
                  <v-list-item-title>RESUME</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="remove(row.id, (row.name || row.url))">
                  <v-list-item-title>DELETE</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <span class="caption ml-3"><strong>URL</strong>: {{ row.url }}</span>

          <v-simple-table dense class="ma-2 bordered">
            <template v-slot:default>
              <tbody>
                <tr>
                  <th>Price</th>
                  <td>{{ product.price | toCurrency }}</td>
                  <th>Status</th>
                  <td>{{ row.status }}</td>
                </tr>
                <tr>
                  <th>Last Check</th>
                  <td>{{ product.lastCheck || 'NA' }}</td>
                  <th>Seller</th>
                  <td>{{ row.seller || 'NA' }}</td>
                </tr>
                <tr>
                  <th>Last Update</th>
                  <td>{{ product.lastUpdate || 'NA' }}</td>
                  <th>Platform</th>
                  <td>{{ row.platform || 'NA' }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </div>

      <p v-else class="mt-5">
        No link found! You can add a new one.
      </p>

      <LinkEdit ref="editDialog" @saved="refreshLinks" />
      <confirm ref="confirm"></confirm>
    </div>

    <div v-else>
      Invalid product!
    </div>
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
    async changeStatus(id, status) {
      const result = await LinkService.changeStatus(id, status);
      if (result == true) this.refreshLinks();
    },
    remove(id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
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
    isSuitable(current, target) {
      switch (current) {
        case 'AVAILABLE':
          return (target == 'RENEWED' || target == 'PAUSED');
        case 'PAUSED':
          return (target == 'RESUMED');
        case 'NEW':
        case 'RENEWED':
        case 'BE_IMPLEMENTED':
        case 'IMPLEMENTED':
        case 'NOT_AVAILABLE':
        case 'READ_ERROR':
        case 'SOCKET_ERROR':
        case 'NETWORK_ERROR':
        case 'CLASS_PROBLEM':
        case 'INTERNAL_ERROR':
          return (target == 'PAUSED');
        default:
          return false;
      }
    }
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
    border: 1px solid #ddd;
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
