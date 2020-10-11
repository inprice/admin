<template>
  <div>

    <p class="mt-3" v-if="!rows || rows.length < 1">
      No link found! Please change your criteria or add new competitors to your products.
    </p>

    <v-hover v-else v-for="row in rows" :key="row.id">
      <template v-slot="{ hover }">

        <v-card class="mb-1 transition-swing" :class="`elevation-${hover ? 3 : 1}`">

          <div v-if="!row.lastUpdate">

            <div class="pa-3 d-flex justify-space-between">
              <div class="text-truncate caption">
                <div>{{ row.status }}</div>
                <a :href="row.url" target="_blank">{{ row.url }}</a>
              </div>

              <div class="my-auto">

                <v-btn outlined small text class="mr-2 mt-1">
                  Details
                </v-btn>

                <v-menu offset-y left>
                  <template v-slot:activator="{ on }">
                    <v-btn x-small fab  elevation="1" v-on="on">
                      <v-icon dark>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item :to="{name: 'product', params: { id: row.productId }}">
                      <v-list-item-title>
                        GO TO PRODUCT PAGE
                      </v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="remove(row.id, (row.name || row.url))">
                      <v-list-item-title>DELETE</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

              </div>
            </div>
          </div>

          <div v-else>
            <div class="d-flex justify-space-between caption px-3 pt-1">
              <div>#{{ row.sku }}</div>
              <div>{{ row.status }}</div>
            </div>

            <div class="d-flex justify-space-between subtitle px-3 pt-1">
              <div class="">{{ row.name }}</div>
              <div>{{ row.price | toPrice }}</div>
            </div>

            <div class="row px-3">
              <div class="col text-truncate pt-1">
                <a :href="row.url" target="_blank">{{ row.url }}</a>
              </div>
            </div>

            <div class="row px-3">
              <div class="col">
                <div class="caption">Seller</div>
                <ago :date="row.seller" />
              </div>
              <div class="col">
                <div class="caption">Platform</div>
                <ago :date="row.platform" />
              </div>
              <div class="col">
                <div class="caption">Last Checked</div>
                <ago :date="row.lastChecked" />
              </div>
              <div class="col">
                <div class="caption">Last Updated</div>
                <ago :date="row.lastUpdated" />
              </div>
            </div>
          </div>

        </v-card>

      </template>
    </v-hover>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import LinkService from '@/service/link';
import Utility from '@/helpers/utility';

export default {
  props: ['rows'],
  methods: {
    remove(id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            Utility.showInfoMessage('Delete Link', 'Link successfully deleted.');
            this.refreshMembers();
          }
        }
      });
    }
  },
  components: {
    confirm: () => import('@/component/Confirm.vue'),
  }
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
