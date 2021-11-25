<template>
  <div>
    <div class="d-flex justify-space-between mt-3">
      <v-btn small @click="$router.go(-1)">Back</v-btn>
      <span class="title font-weight-light">Link Details</span>

      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-on="on"
            v-bind="attrs"
          >
            Menu
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item link @click="$router.push({ name: 'product', params: { id: link.info.productId } })">
            <v-list-item-title>OPEN PRODUCT</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="remove" :disabled="$store.get('session/isNotEditor')">
            <v-list-item-title>DELETE</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-divider class="my-2" ></v-divider>

    <div v-if="link">
      <div v-if="link.info.name" class="d-flex justify-space-between title">
        <div class="my-auto">
          <div class="caption font-weight-medium teal--text">{{ link.info.sku }}</div>
          <div>{{ link.info.name }}</div>
        </div>
        <div class="text-right my-auto">
          <div 
            class="caption font-weight-medium" 
            :style="'color: ' + findPositionColor(link.info.position)"
          >
            {{ link.info.position }}
          </div>
          <div>{{ link.info.price | toPrice }}</div>
        </div>
      </div>

      <div v-else>
        <div class="col caption pa-0">
          <div class="d-flex justify-space-between">
            <a class="my-auto" :href="link.info.url" target="_blank">{{ link.info.url }}</a>
            <v-btn
              small
              icon
              title="Copy Url"
              class="my-auto"
              @click.stop="copyTheLink(link.info.url)"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>
        </div>
        <v-divider class="mt-2"></v-divider>
      </div>

      <v-card v-if="link.info.name" class="mt-2">
        <table class="property-table" v-show="$vuetify.breakpoint.smAndUp">
          <tr>
            <th>Status</th>
            <td>{{ link.info.grup }}</td>
            <th>Sku</th>
            <td>{{ link.info.sku }}</td>
          </tr>

          <tr>
            <th>Position</th>
            <td>{{ link.info.position }}</td>
            <th>Seller</th>
            <td>{{ link.info.seller }}</td>
          </tr>

          <tr>
            <th>Checked</th>
            <td>{{ link.info.checkedAt | formatPlainDate }}</td>
            <th>Brand</th>
            <td>{{ link.info.brand }}</td>
          </tr>

          <tr>
            <th>Updated</th>
            <td>{{ link.info.updatedAt | formatPlainDate }}</td>
            <th>Shipment</th>
            <td>{{ link.info.shipment }}</td>
          </tr>
        </table>

        <table class="property-table" v-show="$vuetify.breakpoint.xs">
          <tr><th>Status</th><td>{{ link.info.grup }}</td></tr>
          <tr><th>Position</th><td>{{ link.info.position }}</td></tr>
          <tr><th>Checked</th><td>{{ link.info.checkedAt | formatPlainDate }}</td></tr>
          <tr><th>Updated</th><td>{{ link.info.updatedAt | formatPlainDate }}</td></tr>
          <tr><th>Sku</th><td>{{ link.info.sku }}</td></tr>
          <tr><th>Seller</th><td>{{ link.info.seller }}</td></tr>
          <tr><th>Brand</th><td>{{ link.info.brand }}</td></tr>
          <tr><th>Shipment</th><td>{{ link.info.shipment }}</td></tr>
        </table>

        <div class="col caption pa-2">
          <div class="d-flex justify-space-between">
            <a class="my-auto" :href="link.info.url" target="_blank">{{ link.info.url }}</a>
            <v-btn
              small
              icon
              title="Copy Url"
              class="my-auto"
              @click.stop="copyTheLink(link.info.url)"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>

      <div class="title mt-5 mb-2">Alarm Condition</div>
      <v-card class="pa-4 pl-3 d-flex justify-space-between">
        <span>{{ link.info.alarmName || 'NotSet' }}</span>
        <v-btn
          small dark
          color="red"
          @click="setAlarmOff"
          v-if="link.info.alarmId"
        >
          Set Off
        </v-btn>
        <v-btn
          small
          color="success"
          @click="openSelectAlarmDialog"
          v-else
        >
          Set On
        </v-btn>
      </v-card>

      <price-list :list="link.priceList"></price-list>
      <history-list :list="link.historyList"></history-list>
      <spec-list :list="link.specList"></spec-list>

      <confirm ref="confirm"></confirm>
      <alarm-select-dialog ref="alarmSelectDialog"></alarm-select-dialog>
    </div>

    <block-message 
      v-else dense
      :loading="loading"
      :message="loading ? 'Loading, please wait...' : 'Unknown link.'"
    />

  </div>
</template>

<script>
import LinkService from '@/service/link';

export default {
  data() {
    return {
      link: null,
      loading: true,
      alarmRefresher: 0
    };
  },
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.link.info.name || this.link.info.url).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ this.link.info.id ]);
          if (result && result.status) this.$router.go(-1);
        }
      });
    },
    openSelectAlarmDialog() {
      this.$refs.alarmSelectDialog.open('LINK').then(async (selectedAlarmId) => {
        if (selectedAlarmId) {
          LinkService.setAlarmON({ alarmId: selectedAlarmId, entityIdSet: [ this.link.info.id ] }).then((res) => {
            if (res && res.status) {
              this.getDetails();
            }
          });
        }
      });
    },
    setAlarmOff() {
      this.$refs.confirm.open('Set Alarm Off', 'Alarm will be off for this link. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          LinkService.setAlarmOFF({ entityIdSet: [ this.link.info.id ] }).then((res) => {
            if (res && res.status) {
              this.getDetails();
            }
          });
        }
      });
    },
    getDetails() {
      this.loading = true;
      const id = this.$route.params.id;
      if (id && id > 0) {
        LinkService.getDetails(id).then((res) => {
          if (res && res.status) {
            this.link = res.data;
          }
        }).finally(() => this.loading = false);
      }
    },
    copyTheLink(url) {
      this.copyToClipboard(url);
      this.$store.commit('snackbar/setMessage', { text: 'Url copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDetails();
    });
  },
  watch: { 
    '$route.params.id': {
        handler: function() {
          this.getDetails();
        },
      }
  },
  components: {
    PriceList: () => import('./PriceList.vue'),
    HistoryList: () => import('./HistoryList.vue'),
    SpecList: () => import('./SpecList.vue'),
    AlarmSelectDialog: () => import('@/views/alarm/Select.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>
