<template>
  <div>
    <v-btn 
      small
      @click="$router.go(-1)"
    >
      Back
    </v-btn>

    <div class="title my-5 mb-3">Details</div>

    <div v-if="link">
      <v-card tile>

        <div class="d-flex justify-space-between pt-5 pa-3">
          <div>{{ link.info.name }}</div>

          <div class="d-flex my-auto">
            <div class="font-weight-medium" v-if="link.info.price"> {{ link.info.price | toPrice }}</div>
            <div>
              <v-menu offset-y bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small icon
                    class="mx-1"
                    v-bind="attrs"
                    v-on="on"
                    @click.stop=""
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>

                  <v-list-item link @click="$router.push({ name: 'group', params: { id: link.info.groupId } })">
                    <v-list-item-title>OPEN GROUP PAGE</v-list-item-title>
                  </v-list-item>

                  <v-list-item link target="_blank" :href="link.info.url">
                    <v-list-item-title>OPEN NEW TAB</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link @click="remove" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>DELETE</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link @click="openAlarmDialog" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>SET ALARM</v-list-item-title>
                  </v-list-item>

                </v-list>
              </v-menu>
            </div>
          </div>

        </div>

        <v-divider></v-divider>

        <div class="d-flex">
          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">SKU</div>
                <div class="body-2">{{ link.info.sku }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Seller</div>
                <div class="body-2">{{ link.info.seller }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Brand</div>
                <div class="body-2">{{ link.info.brand }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Shipment</div>
                <div class="body-2">{{ link.info.shipment }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>

          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Level</div>
                <div class="body-2">{{ link.info.level }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Status</div>
                <div class="body-2">{{ link.info.status }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Checked</div>
                <div class="body-2">{{ link.info.checkedAt | formatPlainDate }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption font-weight-light">Updated</div>
                <div class="body-2">{{ link.info.updatedAt | formatPlainDate }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>
        </div>

        <v-list class="pa-0">
          <v-list-item link :href="link.info.url" target="_blank" class="px-3">
            <v-list-item-content>
              <div class="caption font-italic font-weight-light">{{ link.info.url }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <price-list :list="link.priceList"></price-list>
      <history-list :list="link.historyList"></history-list>
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
      :message="'Unknown link.'"
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
      const id = this.$route.params.id;
      if (id != undefined && id) {
        LinkService.getDetails(id).then((res) => {
          if (res && res.status) {
            this.link = res.data;
          }
        });
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
