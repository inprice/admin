<template>
  <div class="body-2 d-flex">
    <div v-if="alarm">
      <span v-if="!hasIcon">Alarm </span>
      Will be triggered when
      <span class="text-capitalize green--text"><b>{{ alarm.subject.toLowerCase()}}</b></span> 
      <span v-html="findLastPart()"></span>
      <v-btn
        small dark
        color="cyan"
        class="ml-3"
        v-if="editable"
        @click="$emit('clicked')"
      >
        Edit
      </v-btn>
    </div>
    <div v-else>
      <span>No alarm set yet.</span>
      <v-btn
        small dark
        color="cyan"
        class="ml-3"
        v-if="editable"
        @click="$emit('clicked')"
      >
        Set
      </v-btn>
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
        value = ` is <span class="red--text"><b>${this.alarm.subjectWhen}</b></span> to <span class="blue--text"><b>${this.alarm.certainPosition}</b></span>`;
      } if (this.alarm.subjectWhen == 'OUT_OF_LIMITS') {
        if (this.alarm.amountLowerLimit > 0 && this.alarm.amountUpperLimit > 0) {
          value = ` is less than <span class="red--text"><b>${this.alarm.amountLowerLimit}</b></span> or greater than <span class="blue--text"><b>${this.alarm.amountUpperLimit}</b></span>`;
        } if (this.alarm.amountLowerLimit > 0) {
          value = ` is less than <span class="red--text"><b>${this.alarm.amountLowerLimit}</b></span>`;
        } if (this.alarm.amountUpperLimit > 0) {
          value = ` is greater than <span class="red--text"><b>${this.alarm.amountUpperLimit}</b></span>`;
        }
      }
      if (value == null) value = ` is <span class="red--text"><b>${this.normalizeEnum(this.alarm.subjectWhen)}</b></span>`;

      if (this.alarm.notifiedAt) {
        value += '<br>Last notified at ' + this.alarm.notifiedAt;
      }

      return value;
    }
  }
}
</script>
