<template>
  <div>
    <div class="d-flex justify-space-between my-3 mb-5">
      <v-btn small @click="$router.go(-1)">Back</v-btn>

      <v-menu offset-y bottom left v-if="link">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click.stop=""
          >
            Menu
          </v-btn>
        </template>

        <v-list dense>

          <v-list-item link target="_blank" :href="link.info.url">
            <v-list-item-title>OPEN LINK'S WEBPAGE</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link @click="remove" :disabled="$store.get('session/isNotEditor')">
            <v-list-item-title>DELETE THIS LINK</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link @click="openAlarmDialog">
            <v-list-item-title>SET ALARM</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>
    </div>

    <v-divider class="mb-3"></v-divider>

    <div v-if="link">

      <div v-if="link.info.name" class="d-flex justify-space-between pr-3 title">
        <div >{{ link.info.name }}</div>
        <div class="title" v-if="link.info.price"> {{ link.info.price | toPrice }}</div>
      </div>

      <div v-else class="body-2">
        {{ link.info.url }}
      </div>

      <v-card v-if="link.info.name" tile class="my-2">
        <div class="d-flex">
          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">SKU</div>
                <div class="body-2">{{ link.info.sku }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Seller</div>
                <div class="body-2">{{ link.info.seller }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Brand</div>
                <div class="body-2">{{ link.info.brand }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Shipment</div>
                <div class="body-2">{{ link.info.shipment }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>

          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Level</div>
                <div class="body-2">{{ link.info.level }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Status</div>
                <div class="body-2">{{ link.info.status }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Checked</div>
                <div class="body-2">{{ link.info.checkedAt | formatPlainDate }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Updated</div>
                <div class="body-2">{{ link.info.updatedAt | formatPlainDate }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

          </v-list>
        </div>

        <v-list class="col pa-1 pt-0">
          <v-list-item link :href="link.info.url" target="_blank">
            <v-list-item-content>
              <div class="caption blue--text">URL</div>
              <div class="caption">{{ link.info.url }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <history-list :list="link.historyList"></history-list>
      <price-list :list="link.priceList"></price-list>
      <spec-list :list="link.specList"></spec-list>

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
      loading: true
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
          subject: 'STATUS',
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
        this.link.info.alarmId = result.data.id;
      }
    },
    setAlarmOff(form) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          const self = this;
          AlarmService.remove(form.id).then((res) => {
            if (res && res.status) {
              self.link.info.alarmId = null;
              self.link.info.alarm = null;
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
    }
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
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>
