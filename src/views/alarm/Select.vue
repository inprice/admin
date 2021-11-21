<template>
  <v-dialog
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
    style="z-index: 100"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Please select a condition</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3" v-if="alarms && alarms.length">
        <v-select
          dense
          outlined
          clearable
          label="Alarm"
          :items="alarms"
          item-value="id"
          item-text="name"
          v-model="selectedAlarm"
          return-object
          hide-details
          @keyup.native.enter="agree"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
      </v-card-text>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="agree"
          :disabled="$store.get('session/isNotEditor')"
        >
          OK
        </v-btn>
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
      title: null,
      callback: null,
      alarms: [],
      selectedAlarm: [],
      selectedAlarmId: null,
    };
  },
  methods: {
    open(selectedAlarmId) {
      this.show = true;
      this.title = title;

      Alarmservice.getIdNameList().then((res) => {
        if (res && res.data) {
          this.alarms = res.data;
          this.selectedAlarm = res.data[selectedAlarmId || 0];
        }
      });
      return new Promise((callback) => this.callback = callback);
    },
    agree() {
    agree() {
      if (this.selectedAlarm) {
        this.close({ id: this.selectedAlarm.left, name: this.selectedAlarm.right });
      }
    },
    close(selected) {
      this.callback(selected);
      this.show = false;
      this.selectedAlarm = null;
      this.alarms = [];
    }
  }
}
</script>
