<template>
  <v-card>
    <table class="list-table">
      <thead>
        <tr>
          <th width="3%">
            <v-checkbox
              class="ma-0 pa-0 ml-2"
              hide-details
              v-model="selectAll"
              @click.stop="checkAll"
              :indeterminate="indeterminate"
            />
          </th>
          <th class="text-left">Name</th>
          <th width="10%" class="text-right">Price</th>
          <th width="10%" class="text-center">Change</th>
          <th width="1%"></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          style="cursor: pointer"
          v-for="row in links" :key="row.id"
          @click="$router.push({ name: 'link', params: { id: row.id } })"
        >
          <td class="my-auto">
            <v-checkbox
              class="pa-0 pl-2 pb-2"
              hide-details
              v-model="row.selected"
              @click.stop="checkOne"
            />
          </td>
          <td class="pl-0">
            <div class="d-flex">
              <v-icon 
                class="hidden-xs-only mr-1"
                style="font-size:18px"
                :color="row.alarmId ? 'pink' : '#ddd'" 
                :title="row.alarmId ? `Be notified when ${row.alarmName}` : 'NotSet'" 
              >
                mdi-bell
              </v-icon>
              <div>
                <div v-if="row.status == 'AVAILABLE'" class="caption blue--text font-weight-medium d-flex align-center">
                  <img :src="findDomainIcon(row.platform.domain)" onerror="this.onerror=null;this.src='/icon/not-found.png';" :title="row.platform.domain" width="16"/>
                  <span class="ml-1 caption teal--text">{{ row.seller }}</span>
                </div>
                <div v-else-if="row.grup == 'ACTIVE' || row.grup == 'WAITING'" class="caption green--text">{{ row.statusDescription }}</div>
                <div v-else class="caption red--text">{{ row.statusDescription }}</div>
                <div>{{ row.name || row.url }}</div>
              </div>
            </div>
          </td>
          <td class="align-center pr-0">
            <div class="text-right d-flex justify-end my-auto">
              <div class="mr-1">
                <div 
                  v-if="row.price"
                  class="caption font-weight-medium" 
                  :style="'color: ' + findPositionColor(row.position)"
                >
                  {{ row.position }}
                </div>
                <div>{{ row.price | toPrice }}</div>
              </div>
            </div>
          </td>
          <td>
            <sparkline>
              <sparklineCurve 
                :data="row.prices" 
                :limit="row.prices.length" 
                :styles="{ stroke: '#54a5ff', fill: '#0f0' }" 
              />
            </sparkline>
          </td>
          <td class="my-auto">
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
                <v-list-item link @click="copyTheLink(row.url)">
                  <v-list-item-title>COPY URL</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item link target="_blank" :href="row.url">
                  <v-list-item-title>OPEN WEBPAGE</v-list-item-title>
                </v-list-item>

                <v-list-item link @click="$router.push({ name: 'product', params: { id: row.productId } })" v-if="fromLinksPage">
                  <v-list-item-title>OPEN PRODUCT</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <template v-if="$store.get('session/isNotSuperUser')">
                  <v-list-item link @click="$emit('setAlarmOff', row)" :disabled="$store.get('session/isNotEditor')" v-if="row.alarmId">
                    <v-list-item-title>SET ALARM OFF</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="$emit('openAlarmDialog', row)" :disabled="$store.get('session/isNotEditor')" v-else>
                    <v-list-item-title>SET AN ALARM</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="$emit('moveOne', row)" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>MOVE</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link @click="$emit('deleteOne', row)" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>DELETE</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-group
                  v-else
                  :value="true"
                  no-action
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>CHANGE STATUS</v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item link @click="$emit('changeStatus', { id: row.id, newStatus: 'REFRESHED' })">
                    <v-list-item-title>TO REFRESHED</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="$emit('changeStatus', { id: row.id, newStatus: 'RESOLVED' })">
                    <v-list-item-title>TO RESOLVED</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="$emit('changeStatus', { id: row.id, newStatus: 'PAUSED' })">
                    <v-list-item-title>TO PAUSED</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="$emit('changeStatus', { id: row.id, newStatus: 'NOT_SUITABLE' })">
                    <v-list-item-title>TO NOT SUITABLE</v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-list-item link @click="$emit('undoStatus', row.id)" v-if="$store.get('session/isSuperUser')">
                  <v-list-item-title>UNDO LAST CHANGE</v-list-item-title>
                </v-list-item>

              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
import DomainData from '@/data/domains';

export default {
  props: ['links', 'fromLinksPage'],
  data() {
    return {
      selectAll: false,
      indeterminate: false
    }
  },
  methods: {
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
    },
    changeStatus(row, newStatus) {
      console.log('Change status to ', newStatus, ' id: ', row.id);
    },
    undoStatus(row) {
      console.log('Undo status id: ', row.id);
    },
    findDomainIcon(domain) {
      return DomainData.find(domain).favicon;
    }
  }
}
</script>
