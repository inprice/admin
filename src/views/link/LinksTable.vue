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
                :color="row.alarmId ? 'pink' : '#ccc'" 
                :title="row.alarmId ? row.alarmName : 'NotSet'" 
              >
                mdi-clock-outline
              </v-icon>
              <div>
                <div v-if="row.seller" class="caption teal--text font-weight-medium">{{ row.seller }}</div>
                <div v-if="row.grup == 'PROBLEM'" class="caption pink--text">{{ row.statusDescription }}</div>
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

              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
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
    }
  }
}
</script>
