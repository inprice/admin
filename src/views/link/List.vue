<template>
  <v-card>
    <table class="list-table">
      <thead>
        <tr>
          <th width="5%">
            <v-checkbox
              class="pa-0 pl-2 pb-2"
              hide-details
              v-model="selectAll"
              @click.stop="checkAll"
              :indeterminate="indeterminate"
            />
          </th>
          <th>Name</th>
          <th width="15%" class="text-right">Price</th>
          <th width="5%"></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          style="cursor: pointer"
          v-for="row in links" :key="row.id"
          @click="$router.push({ name: 'row', params: { id: row.id } })"
        >
          <td>
            <v-checkbox
              class="pa-0 pl-2 pb-2"
              hide-details
              v-model="row.selected"
              @click.stop="checkOne"
            />
          </td>
          <td>
            <v-icon
              class="mr-2"
              style="font-size:18px"
              :color="findLevelColor(row.level)"
            >
              mdi-star
            </v-icon>
            <span>{{ row.name || row.url }}</span>
          </td>
          <td class="text-right">{{ row.price | toPrice }}</td>
          <td>
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small icon
                  class="mx-1"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item row @click="copyTheLink(row.url)">
                  <v-list-item-title>COPY URL</v-list-item-title>
                </v-list-item>

                <v-list-item row target="_blank" :href="row.url">
                  <v-list-item-title>OPEN WEBPAGE</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item row @click="openAlarmDialog(row)" :disabled="$store.get('session/isNotEditor')">
                  <v-list-item-title>SET ALARM</v-list-item-title>
                </v-list-item>

                <v-list-item row @click="moveOne(row)" :disabled="$store.get('session/isNotEditor')">
                  <v-list-item-title>MOVE UNDER ANOTHER PRODUCT</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item row @click="deleteOne(row)" :disabled="$store.get('session/isNotEditor')">
                  <v-list-item-title>DELETE THIS</v-list-item-title>
                </v-list-item>

              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </table>

    <confirm ref="confirm" />

    <alarm-dialog
      ref="alarmDialog"
      :key="alarmRefresher"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    ></alarm-dialog>

    <product-select-dialog ref="productSelectDialog"></product-select-dialog>
  </v-card>
</template>

<script>
import LinkService from '@/service/link';
import AlarmService from '@/service/alarm';

export default {
  props: ['links', 'productId'],
  data() {
    return {
      selectAll: false,
      indeterminate: false,
      alarmRefresher: 0
    }
  },
  methods: {
    async deleteOne(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ row.id ], this.productId);
          if (result && result.data) {
            this.data = result.data;
            this.refreshPanels();
          }
        }
      });
    },
    async moveOne(row) {
      this.$refs.productSelectDialog.open('For the selected row, please select a product to move', this.productId).then(async (data) => {
        if (data && (data.id || data.name)) {
          const result = await LinkService.moveTo({
            fromProductId: this.productId,
            toProductId: data.id,
            toProductName: data.name,
            linkIdSet: [ row.id ],
          });
          if (result && result.data) {
            this.data = result.data;
            this.refreshPanels();
          }
        }
      });
    },
    openAlarmDialog(row) {
      let cloned = {};
      if (row.alarm) {
        cloned = JSON.parse(JSON.stringify(row.alarm));
      } else {
        cloned = {
          subject: 'STATUS',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'LINK';
      cloned.linkId = row.id;
      cloned.name = row.name || row.url;
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      const result = await AlarmService.save(form);
      if (result && result.status) {
        this.data.product.alarm = result.data;
        this.alarmRefresher++;
      }
    },
    setAlarmOff(form) {
      AlarmService.remove(form.id).then((res) => {
        if (res && res.status) {
          this.data.product.alarm = null;
          this.alarmRefresher++;
        }
      });
    },
    copyTheLink(url) {
      this.copyToClipboard(url);
      this.$store.commit('snackbar/setMessage', { text: 'Url copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
    checkOne() {
      let selected = 0;
      let notselected = 0;
      this.links.forEach(row => {
        if (row.selected) 
          selected++;
        else
          notselected++;
      });
      this.selectAll = (selected > 0 && selected == this.links.length);
      this.indeterminate = (this.selectAll && selected != 0 || notselected != 0);
      this.$emit('checked');
    },
    checkAll() {
      this.links.forEach(row => row.selected = this.selectAll);
      this.$emit('checked');
      this.indeterminate = false;
    }
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    ProductSelectDialog: () => import('@/views/product/Select.vue'),
  }
}
</script>
