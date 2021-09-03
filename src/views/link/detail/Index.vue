<template>
  <div>
    <div class="mt-2 d-flex justify-space-between">
      <span class="title">Link details</span>
      <v-btn 
        small
        @click="$router.go(-1)"
      >
        Go Back
      </v-btn>
    </div>

    <div v-if="link">

      <!-- ------ -->
      <!--  INFO  -->
      <!-- ------ -->
      <v-card class="mt-3 pa-1 pb-2">
        <div class="pa-3 d-flex justify-space-between">
          <div class="text-truncate">
            <div class="subtitle">{{ link.info.name }}</div>
            <div class="caption font-weight-light">{{ link.info.url }}</div>
          </div>

          <div class="d-flex my-auto pl-3">
            <div class="mx-2 font-weight-medium" v-if="link.info.price"> {{ link.info.price | toPrice }}</div>
            <div>
              <v-menu offset-y bottom left :disabled="$store.get('session/isNotEditor')">
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

        <v-divider class="py-2"></v-divider>

        <v-simple-table class="property-table pt-3 pb-2" dense>
          <template v-slot:default>
            <tbody>
              <property :valueClass="COLUMNS.five" name="SKU" :value="link.info.sku" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.seven" name="Brand" :value="link.info.brand" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.seven" name="Seller" :value="link.info.seller" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.seven" name="Shipment" :value="link.info.shipment" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.five" name="Price" :value="link.info.price | toCurrency" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.five" name="Level" :value="link.info.level" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
              <property :valueClass="COLUMNS.five" name="Status" :value="link.info.statusGroup" />
              <property :valueClass="COLUMNS.eight" name="Checked" :value="link.info.checkedAt" />
              <property :valueClass="COLUMNS.eight" name="Updated" :value="link.info.updatedAt || 'Not yet'" v-if="link.info.statusGroup != 'PROBLEM' && link.info.name"/>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>

      <!-- ------ -->
      <!-- ALARM  -->
      <!-- ------ -->
      <v-card class="mt-5">
        <alarm-note
          class="pa-4"
          :alarm="link.info.alarm"
          @clicked="openAlarmDialog"
        ></alarm-note>
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

    <block-message v-else :message="'Link not found!'" />

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
  computed: {
    COLUMNS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            five: 'col-5', seven: 'col-7', eight: 'col-8'
          };
        }
        default: {
          return {
            five: 'col-3', seven: 'col-5', eight: 'col-6'
          };
        }
      }
    },
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
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    Property: () => import('@/component/app/Property.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>
