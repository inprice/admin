<template>
  <v-dialog
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
    style="z-index: 100"
  >
    <v-card :loading="loading">
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span v-if="alarms.length">Please select an alarm</span>
        <span v-else-if="loading == false">No condition found!</span>
        <span v-else-if="loading == true">Loading...</span>
        <v-btn icon @click="close(null)"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-divider v-if="!alarms.length" class="my-2"></v-divider>

      <v-card-text class="py-0 mt-3" v-if="alarms && alarms.length">
        <v-select
          dense
          outlined
          hide-details
          label="Alarm"
          :items="alarms"
          item-value="left"
          item-text="right"
          v-model="selectedAlarmId"
          @keyup.native.enter="agree"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
      </v-card-text>

      <v-card-actions class="pa-3 pt-0" :class="{ 'justify-end': alarms.length > 0}">
        <v-btn
          text
          @click="agree"
          v-if="alarms.length"
          :disabled="$store.get('session/isNotEditor')"
        >
          OK
        </v-btn>
        <div v-else-if="loading == true">Please wait...</div>
        <div v-else-if="loading == false" class="pa-3">You need to define your alarm conditions first!</div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Alarmservice from '@/service/alarm';

export default {
  name: 'alarm-select',
  data() {
    return {
      show: false,
      callback: null,
      alarms: [],
      selectedAlarmId: null,
      loading: false,
    };
  },
  methods: {
    open(topic) {
      this.loading = true;
      this.show = true;
      Alarmservice.getIdNameList(topic).then((res) => {
        if (res && res.data) {
          this.alarms = res.data;
          if (this.alarms && this.alarms.length) this.selectedAlarmId = this.alarms[0].left;
        }
      }).finally(() => this.loading = false);
      return new Promise((callback) => this.callback = callback);
    },
    agree() {
      if (this.selectedAlarmId) {
        this.close(this.selectedAlarmId);
      }
    },
    close(selected) {
      this.callback(selected);
      this.show = false;
      this.selectedAlarmId = null;
      this.alarms = [];
    }
  }
}
</script>
