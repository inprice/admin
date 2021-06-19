<template>
  <div class="body-2 d-flex" style="cursor: pointer" @click="$emit('clicked')">
    <div v-if="alarm">
      <v-icon class="mr-1">mdi-alarm</v-icon>
      will be triggered when
      <span class="text-capitalize green--text"><b>{{ alarm.subject.toLowerCase()}}</b></span> 
      <span v-html="findLastPart()"></span>
    </div>
    <div v-else>
      <v-icon class="mr-1">mdi-alarm-off</v-icon>
      Click here to set alarm
    </div>
  </div>
</template>

<script>
export default {
  props: ['alarm'],
  methods: {
    findLastPart() {
      if (this.alarm.subjectWhen == 'EQUAL' || this.alarm.subjectWhen == 'NOT_EQUAL') {
        return ` is <span class="red--text"><b>${this.alarm.subjectWhen}</b></span> to <span class="blue--text"><b>${this.alarm.certainStatus}</b></span>`;
      } if (this.alarm.subjectWhen == 'OUT_OF_LIMITS') {
        if (this.alarm.priceLowerLimit > 0 && this.alarm.priceUpperLimit > 0) {
          return ` is less than <span class="red--text"><b>${this.alarm.priceLowerLimit}</b></span> or greater than <span class="blue--text"><b>${this.alarm.priceUpperLimit}</b></span>`;
        } if (this.alarm.priceLowerLimit > 0) {
          return ` is less than <span class="red--text"><b>${this.alarm.priceLowerLimit}</b></span>`;
        } if (this.alarm.priceUpperLimit > 0) {
          return ` is greater than <span class="red--text"><b>${this.alarm.priceUpperLimit}</b></span>`;
        }
      }
      return ` is <span class="red--text"><b>${this.alarm.subjectWhen.replaceAll('_', ' ')}</b></span>`;
    }
  }
}
</script>
