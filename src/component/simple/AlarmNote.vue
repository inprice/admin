<template>
  <div class="body-2 d-flex">
    <div v-if="alarm">
      <span v-if="!hasIcon">Alarm </span>
      Will be triggered when
      <span class="text-capitalize">{{ alarm.subject.toLowerCase()}}</span> 
      <span v-html="findLastPart()"></span>
      <v-chip
        small text label
        color="secondary"
        class="ml-1 font-weight-bold"
        v-if="editable"
        @click="$emit('clicked')"
      >
        EDIT
      </v-chip>
    </div>
    <div v-else>
      <span>No alarm set yet.</span>
      <v-chip
        small outlined text
        color="primary"
        class="ml-1 font-weight-bold"
        v-if="editable"
        @click="$emit('clicked')"
      >
        SET
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alarm: { type: Object, },
    editable: { type: Boolean, default: true, },
    hasIcon: { type: Boolean, default: true, },
  },
  methods: {
    findLastPart() {
      let value = null;

      if (this.alarm.subjectWhen == 'EQUAL' || this.alarm.subjectWhen == 'NOT_EQUAL') {
        value = ` is <span class="">${this.alarm.subjectWhen}</span> to <span class="">${this.alarm.certainPosition}</span>.`;
      } if (this.alarm.subjectWhen == 'OUT_OF_LIMITS') {
        if (this.alarm.amountLowerLimit > 0 && this.alarm.amountUpperLimit > 0) {
          value = ` is less than <span class="">${this.alarm.amountLowerLimit}</span> or greater than <span class="">${this.alarm.amountUpperLimit}</span>.`;
        } else if (this.alarm.amountLowerLimit > 0) {
          value = ` is less than <span class="">${this.alarm.amountLowerLimit}</span>.`;
        } else if (this.alarm.amountUpperLimit > 0) {
          value = ` is greater than <span class="">${this.alarm.amountUpperLimit}</span>.`;
        }
      }
      if (value == null) value = ` is <span class="text-capitalize">${this.alarm.subjectWhen.toLowerCase()}</span>.`;

      if (this.alarm.notifiedAt) {
        value += '<br>Last notified at ' + this.alarm.notifiedAt + '.';
      }

      return value;
    }
  }
}
</script>
