<template>
  <div>
    <div class="d-flex justify-space-between my-3">
      <v-btn small @click="$router.go(-1)">Back</v-btn>
      <span class="title font-weight-light">{{ data.name }}</span>
      <div>
        <v-btn 
          small
          class="mr-1"
          color="error"
          v-if="data.id"
          @click="remove"
          :disabled="$store.get('session/isNotEditor')"
        >
          DELETE
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <div v-if="data.id">
      <div class="mt-5" v-if="data.topic == 'PRODUCT'">
        <div class="title pb-3">
          Products using this alarm
        </div>
        <div class="body-2 mb-3" v-if="data.products && data.products.length && !loading">
          <v-card>
            <table class="list-table">
              <thead>
                <tr>
                  <th width="12%" class="text-left hidden-xs-only">Sku</th>
                  <th class="text-left">Name</th>
                  <th width="15%" class="text-left hidden-xs-only">Notified At</th>
                  <th width="8%" class="text-left">Position</th>
                  <th width="10%" class="text-right">Price</th>
                  <th width="4%"></th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="row in data.products" :key="row.id"
                >
                  <td class="hidden-xs-only">{{ row.sku }}</td>
                  <td>{{ row.name }}</td>
                  <td class="hidden-xs-only"><ago :date="row.alarmedAt" v-if="row.alarmedAt" /><span v-else>NotYet</span></td>
                  <td>{{ row.position }}</td>
                  <td class="text-right">{{ row.price | toPrice }}</td>
                  <td>
                    <v-menu offset-y bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small icon
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item link @click="$router.push({ name: 'product', params: { id: row.id } })">
                          <v-list-item-title>OPEN DETAILS</v-list-item-title>
                        </v-list-item>

                        <v-list-item link @click="removeProductBinding(row.id)" :disabled="$store.get('session/isNotEditor')">
                          <v-list-item-title>REMOVE ALARM</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card>
        </div>

        <block-message 
          v-if="loading || !data.products || !data.products.length"
          :loading="loading"
          :message="loading ? 'Loading, please wait...' : 'No linked product found!'"
        />
      </div>

      <div class="mt-5" v-if="data.topic == 'LINK'">
        <div class="title pb-3">
          Competitor links using this alarm
        </div>
        <div class="body-2 mb-3" v-if="data.links && data.links.length && !loading">
          <v-card>
            <table class="list-table">
              <thead>
                <tr>
                  <th width="12%" class="text-left hidden-xs-only">Sku</th>
                  <th class="text-left">Name</th>
                  <th width="15%" class="text-left hidden-xs-only">Notified At</th>
                  <th width="8%" class="text-left">Position</th>
                  <th width="10%" class="text-right">Price</th>
                  <th width="4%"></th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="row in data.links" :key="row.id"
                >
                  <td class="hidden-xs-only">{{ row.sku }}</td>
                  <td>{{ row.name }}</td>
                  <td class="hidden-xs-only"><ago :date="row.alarmedAt" v-if="row.alarmedAt" /><span v-else>NotYet</span></td>
                  <td>{{ row.position }}</td>
                  <td class="text-right">{{ row.price | toPrice }}</td>
                  <td>
                    <v-menu offset-y bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small icon
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item link @click="$router.push({ name: 'link', params: { id: row.id } })">
                          <v-list-item-title>OPEN DETAILS</v-list-item-title>
                        </v-list-item>

                        <v-list-item link @click="removeLinkBinding(row.id)" :disabled="$store.get('session/isNotEditor')">
                          <v-list-item-title>REMOVE ALARM</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card>
        </div>

        <block-message 
          v-if="loading || !data.links || !data.links.length"
          :loading="loading"
          :message="loading ? 'Loading, please wait...' : 'No competitor links found!'"
        />
      </div>
    </div>

    <block-message 
      v-else
      class="mt-5"
      message="Alarm not found"
    />

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import AlarmService from '@/service/alarm';

export default {
  data() {
    return {
      data: {},
      loading: false
    };
  },
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.name).then(async (confirm) => {
        if (confirm == true && this.isNumeric(this.data.id)) {
          const result = await AlarmService.remove(this.data.id);
          if (result && result.status) this.$router.go(-1);
        }
      });
    },
    removeProductBinding(productId) {
      this.$refs.confirm.open('Set Alarm Off', 'will be OFF. Are you sure?', 'This product\'s alarm ').then(async (confirm) => {
        if (confirm == true) {
          const result = await AlarmService.setAlarmOFF({ topic: 'PRODUCT', entityIdSet: [ productId ] });
          if (result && result.status) this.find();
        }
      });
    },
    removeLinkBinding(linkId) {
      this.$refs.confirm.open('Set Alarm Off', 'will be OFF. Are you sure?', 'This link\'s alarm ').then(async (confirm) => {
        if (confirm == true) {
          const result = await AlarmService.setAlarmOFF({ topic: 'LINK', entityIdSet: [ linkId ] });
          if (result && result.status) this.find();
        }
      });
    },
    find() {
      if (this.isNumeric(this.$route.params.id) == false) {
        return;
      }
      this.loading = true;
      AlarmService.getDetails(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      }).finally(() => this.loading = false);
    },
  },
  mounted() {
    this.find();
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  watch: {
    '$route.params.id': {
        handler: function() {
          this.find();
        },
      }
  },
};
</script>
