<template>
  <v-dialog 
    v-model="show" 
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card v-if="topic">
      <v-card-title class="pb-0 d-flex justify-space-between no-gutters">
        <div class="text-truncate col mr-2">
          <div>
            {{ form.id ? 'Edit' : 'New' }} 
            <span class="text-capitalize">{{ topic.toLowerCase() }}</span>
            Alarm
          </div>
          <div v-if="problem" class="caption red--text">{{ problem }}</div>
          <div v-else class="caption">For {{ name }}</div>
        </div>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-divider class="my-2"></v-divider>

      <v-stepper
        vertical
        v-model="stepNo"
      >
        <v-stepper-step
          editable
          step="1"
          color="success"
        >
          <div>Subject</div>
          <div><small class="caption">For which subject: <b>{{ findSubjectTextByValue }}</b></small></div>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-radio-group
            dense
            @change="onSubjectChanged"
            v-model="form.subject"
          >
            <v-radio
              v-for="(sub, ix) in subjects[topic]" :key="ix"
              class="text-capitalize"
              :label="sub.text"
              :value="sub.value"
            ></v-radio>
          </v-radio-group>

          <v-btn
            small
            class="mb-3"
            @click="stepNo = 2"
          >
            Next
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </v-stepper-content>

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="2"
          color="success"
          class="font-weight-medium"
        >
          When
          <small class="caption">{{ findSubjectTextByValue }} is <b>{{ findWhenTextByValue }}</b></small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-radio-group
            dense
            @change="onWhenChanged"
            v-model="form.subjectWhen"
          >
            <v-radio
              v-for="(whn, ix) in subjectWhens" :key="ix"
              class="text-capitalize"
              :label="whn.text"
              :value="whn.value"
            ></v-radio>
          </v-radio-group>

          <v-btn
            small
            class="mb-3 mr-1"
            @click="stepNo = 1"
          >
            <v-icon>mdi-menu-left</v-icon>
            Prev
          </v-btn>
          <v-btn
            small
            class="mb-3 ml-1"
            @click="stepNo = 3"
          >
            Next
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </v-stepper-content>

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="3"
          color="success"
          class="font-weight-medium"
        >
          Conditions
          <small>{{ isConditionsBlockShowed() ? 'Please specify your conditions' : 'No condition needed!' }}</small>
        </v-stepper-step>

        <v-stepper-content step="3">
          <div v-if="isConditionsBlockShowed()" class="mr-5">
            <v-select
              dense
              outlined
              hide-details
              label="Position"
              class="my-3"
              v-model="form.certainPosition"
              :items="positions"
              item-text="text"
              item-value="value"
              v-if="form.subject == 'POSITION' && form.subjectWhen != 'CHANGED'"
            ></v-select>

            <div
              class="d-flex justify-space-between mt-3"
              v-if="form.subject != 'POSITION' && form.subjectWhen == 'OUT_OF_LIMITS'"
            >
              <v-text-field
                dense
                outlined
                label="Lower Limit"
                v-model="form.amountLowerLimit"
                :messages="hint.amountLowerLimit"
                :error="hint.amountLowerLimit != null"
                @blur="formatPrices"
                maxlength="10"
                type="number"
                class="px-2"
              ></v-text-field>
              <v-text-field
                dense
                outlined
                label="Upper Limit"
                v-model="form.amountUpperLimit"
                :messages="hint.amountUpperLimit"
                :error="hint.amountUpperLimit != null"
                @blur="formatPrices"
                maxlength="10"
                type="number"
                class="px-2"
              ></v-text-field>
            </div>
          </div>

          <block-message v-else dense class="my-3 mr-4" :message="'No condition needed!'" />

          <v-btn
            small
            class="mb-3"
            @click="stepNo = 2"
          >
            <v-icon>mdi-menu-left</v-icon>
            Prev
          </v-btn>
        </v-stepper-content>
      </v-stepper>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          tabindex="-1"
          color="red"
          @click="setOff"
          :disabled="!form.id"
        >
          Remove
        </v-btn>
        <v-btn
          text
          @click="save"
          color="success"
          :disabled="$store.get('session/isNotEditor') || isFormValid() == false"
        >
          {{ form.id ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SystemData from '@/data/system';

const subjects = {
  LINK:  [
    { text: 'Position', value: 'POSITION' },
    { text: 'Price', value: 'PRICE' }
  ],
  PRODUCT: [
    { text: 'Position', value: 'POSITION' },
    { text: 'Minimum',  value: 'MINIMUM' },
    { text: 'Average',  value: 'AVERAGE' },
    { text: 'Maximum',  value: 'MAXIMUM' }
  ]
};

const whens = {
  POSITION: [
    { text: 'Changed', value: 'CHANGED' },
    { text: 'Equal', value: 'EQUAL' },
    { text: 'Not equal', value: 'NOT_EQUAL' }
  ],
  PRICE:  [
    { text: 'Increased', value: 'INCREASED' },
    { text: 'Decreased', value: 'DECREASED' },
    { text: 'Out of limits', value: 'OUT_OF_LIMITS' }
  ]
};

const positions = {
  LINK:  SystemData.LINK_STATUSES,
  PRODUCT: SystemData.POSITIONS
};

export default {
  data() {
    return {
      show: false,
      form: {
        id: null,
        subject: 'POSITION',
        subjectWhen: 'CHANGED',
        certainPosition: 'ACTIVE',
        amountLowerLimit: 0,
        amountUpperLimit: 0,
      },
      hint: {
        amountLowerLimit: null,
        amountUpperLimit: null,
      },
      name: null,
      topic: 'LINK',
      subjects,
      positions: null,
      subjectWhens: null,
      stepNo: 1,
      problem: null
    };
  },
  computed: {
    findSubjectTextByValue() {
      let value = null;
      subjects[this.topic].forEach(sub => {
        if (sub.value == this.form.subject) {
          value = sub.text;
          return;
        }
      });
      return value;
    },
    findWhenTextByValue() {
      let value = null;
      whens[this.form.subject == 'POSITION' ? this.form.subject : 'PRICE'].forEach(whn => {
        if (whn.value == this.form.subjectWhen) {
          value = whn.text;
          return;
        }
      });
      return value;
    }
  },
  methods: {
    open(data) {
      this.show = true;
      if (data) {
        this.form = data;
        this.name = data.name;
        this.topic = data.topic.toUpperCase();
        if (data.id) this.stepNo = 3;
      } else {
        this.form.id = null;
        this.form.subject = 'POSITION';
        this.form.subjectWhen = 'CHANGED';
        this.form.certainPosition = 'ACTIVE';
        this.form.amountLowerLimit = 0;
        this.form.amountUpperLimit = 0;
        this.hint.amountLowerLimit = null;
        this.hint.amountUpperLimit = null;
      }
      this.positions = positions[this.topic];
      this.subjectWhens = whens[this.form.subject == 'POSITION' ? this.form.subject : 'PRICE'];
      this.$nextTick(() => this.formatPrices());
    },
    save() {
      if (this.isFormValid) {
        this.$emit('saved', this.form);
        this.close();
      } else {
        this.hint.amountLowerLimit = null;
        this.hint.amountUpperLimit = null;
        if (this.form.subject != 'POSITION' && this.form.subjectWhen == 'OUT_OF_LIMITS') {
          if (parseFloat(this.form.amountLowerLimit) < 1) {
            if (parseFloat(this.form.amountUpperLimit) < 1) this.hint.amountLowerLimit = 'Required';
          }
          if (parseFloat(this.form.amountUpperLimit) < 1) {
            if (parseFloat(this.form.amountLowerLimit) < 1) this.hint.amountUpperLimit = 'Required';
          }
        }
      }
    },
    setOff() {
      this.$emit('setOff', this.form);
      this.close();
    },
    close() {
      this.show = false;
    },
    onSubjectChanged() {
      this.subjectWhens = whens[this.form.subject == 'POSITION' ? this.form.subject : 'PRICE'];
      this.form.subjectWhen = this.subjectWhens[0].value;
    },
    onWhenChanged() {
      if (this.form.subjectWhen == 'EQUAL' || this.form.subjectWhen == 'NOT_EQUAL') {
        this.form.certainPosition = this.positions[0];
      }
    },
    formatPrices() {
      this.form.amountLowerLimit = parseFloat(('0' + this.form.amountLowerLimit).replace(/[^\d.]/g, '')).toFixed(2);
      this.form.amountUpperLimit = parseFloat(('0' + this.form.amountUpperLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    isConditionsBlockShowed() {
      return (this.form.subject == 'POSITION' && this.form.subjectWhen != 'CHANGED') || (this.form.subject != 'POSITION' && this.form.subjectWhen == 'OUT_OF_LIMITS');
    },
    isFormValid() {
      if (this.form.subject == 'POSITION' && this.form.subjectWhen != 'CHANGED' && !this.form.certainPosition) {
        this.problem = 'Position must be specified!';
        return false;
      } else {
        if (this.form.subject != 'POSITION' && this.form.subjectWhen == 'OUT_OF_LIMITS') {
          if (parseFloat(this.form.amountLowerLimit) < 1) {
            if (parseFloat(this.form.amountUpperLimit) < 1) {
              this.problem = 'You need to specify a positive value for either lower or upper limit!';
              return false;
            }
          }
          if (parseFloat(this.form.amountUpperLimit) < 1) {
            if (parseFloat(this.form.amountLowerLimit) < 1) {
              this.problem = 'You need to specify a positive value for either lower or upper limit!';
              return false;
            }
          }
          if (parseFloat(this.form.amountLowerLimit) > 0 && parseFloat(this.form.amountUpperLimit) > 0) {
            if (parseFloat(this.form.amountLowerLimit) >= parseFloat(this.form.amountUpperLimit)) {
              this.problem = 'Lower limit cannot be greater or equal to Upper limit!';
              return false;
            }
          }
        }
      }
      this.problem = null;
      return true;
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  }
};
</script>

<style scoped>
  .v-stepper {
    box-shadow: none;
  }
  .v-stepper--vertical {
    padding-bottom: 0px;
  }
  .v-stepper--vertical .v-stepper__step {
    padding: 10px 20px;
  }
  .v-stepper--vertical .v-stepper__content {
    margin: auto !important;
    padding: 0 0 0 40px;
  }
  .v-stepper__wrapper > .v-input--selection-controls {
    margin-top: 5px;
  }
  .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
    padding-left: 10px;
  }
</style>