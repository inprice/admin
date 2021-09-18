<template>
  <div class="body-2 d-flex" :style="editable ? 'cursor: pointer' : ''" @click="$emit('clicked')">
    <div v-if="alarm">
      <span v-if="!hasIcon">Alarm </span>
      will be triggered when
      <span class="text-capitalize green--text"><b>{{ alarm.subject.toLowerCase()}}</b></span> 
      <span v-html="findLastPart()"></span>
    </div>
    <div v-else>
      <span class="mr-1">No alarm.</span>
      <span v-if="editable">
        Click here to set for this.
      </span>
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
      if (this.alarm.subjectWhen == 'EQUAL' || this.alarm.subjectWhen == 'NOT_EQUAL') {
        return ` is <span class="red--text"><b>${this.alarm.subjectWhen}</b></span> to <span class="blue--text"><b>${this.alarm.certainStatus}</b></span>`;
      } if (this.alarm.subjectWhen == 'OUT_OF_LIMITS') {
        if (this.alarm.amountLowerLimit > 0 && this.alarm.amountUpperLimit > 0) {
          return ` is less than <span class="red--text"><b>${this.alarm.amountLowerLimit}</b></span> or greater than <span class="blue--text"><b>${this.alarm.amountUpperLimit}</b></span>`;
        } if (this.alarm.amountLowerLimit > 0) {
          return ` is less than <span class="red--text"><b>${this.alarm.amountLowerLimit}</b></span>`;
        } if (this.alarm.amountUpperLimit > 0) {
          return ` is greater than <span class="red--text"><b>${this.alarm.amountUpperLimit}</b></span>`;
        }
      }
      return ` is <span class="red--text"><b>${this.alarm.subjectWhen.replaceAll('_', ' ')}</b></span>`;
    }
  }
}
</script>
