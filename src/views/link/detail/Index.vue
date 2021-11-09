<template>
  <div>
    <div class="d-flex justify-space-between my-3 mb-5">
      <v-btn small @click="$router.go(-1)">Back</v-btn>

      <v-btn
        small
        color="error"
        @click="remove"
        :disabled="$store.get('session/isNotEditor')"
      >
        Delete
      </v-btn>
    </div>

    <div v-if="link">
      <div v-if="link.info.name" class="d-flex justify-space-between title">
        <div>{{ link.info.name }}</div>
        <div class="pl-3 text-right">
          {{ (link.info.price || 0) | toCurrency }}
        </div>
      </div>

      <div v-else>
        <div class="title">Url</div>
        <v-divider class="my-2"></v-divider>
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

      <div class="title mt-5 mb-2">Alarm</div>
      <v-card class="pa-4 pl-3">
        <alarm-note
          :key="alarmRefresher"
          :alarm="link.info.alarm"
          @clicked="openAlarmDialog"
        ></alarm-note>
      </v-card>

      <price-list :list="link.priceList"></price-list>
      <spec-list :list="link.specList"></spec-list>
      <history-list :list="link.historyList"></history-list>

      <alarm-dialog
        ref="alarmDialog"
        @setOff="setAlarmOff"
        @saved="saveAlarm"
      ></alarm-dialog>

      <confirm ref="confirm"></confirm>
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
import AlarmService from '@/service/alarm';

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
    openAlarmDialog() {
      let cloned = {};
      if (this.link.info.alarm) {
        cloned = JSON.parse(JSON.stringify(this.link.info.alarm));
      } else {
        cloned = {
          subject: 'POSITION',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'link';
      cloned.name = this.link.info.name || this.link.info.url;
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      form.linkId = this.link.info.id;
      const result = await AlarmService.save(form);
      if (result && result.status) {
        this.link.info.alarm = result.data;
        this.alarmRefresher++;
      }
    },
    setAlarmOff(form) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          const self = this;
          AlarmService.remove(form.id).then((res) => {
            if (res && res.status) {
              self.link.info.alarm = null;
              this.alarmRefresher++;
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
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>
