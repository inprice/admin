<template>
  <v-dialog 
    v-model="show" 
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between no-gutters">
        <div class="mr-2">
          {{ form.id ? 'Edit' : 'Add a new' }} {{ form.topic.toLowerCase() }} alarm
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
          <div>Topic</div>
          <div><small class="caption">For which entity: <b>{{ form.topic }}</b></small></div>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-radio-group
            dense
            :disabled="form.id > 0"
            @change="resetSubject"
            v-model="form.topic"
          >
            <v-radio
              v-for="(top, ix) in topics" :key="ix"
              :label="top.text"
              :value="top.value"
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
        >
          <div>Subject</div>
          <div><small class="caption">For which subject: <b>{{ form.topic == 'LINK' && form.subject == 'POSITION' ? 'STATUS' : form.subject }}</b></small></div>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-radio-group
            dense
            @change="resetSubjectWhen"
            v-model="form.subject"
          >
            <v-radio
              v-for="(sub, ix) in subjects[form.topic]" :key="ix"
              :label="sub.text"
              :value="sub.value"
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
            class="mb-3"
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
          When
          <small class="caption">For which changing:  <b>{{ whenText }}</b></small>
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-radio-group
            dense
            v-model="form.subjectWhen"
          >
            <v-radio
              v-for="(whn, ix) in whens[this.form.subject == 'POSITION' ? 'POSITION' : 'PRICE']" :key="ix"
              :label="whn.text"
              :value="whn.value"
            ></v-radio>
          </v-radio-group>

          <v-btn
            small
            class="mb-3 mr-1"
            @click="stepNo = 2"
          >
            <v-icon>mdi-menu-left</v-icon>
            Prev
          </v-btn>
          <v-btn
            small
            class="mb-3 ml-1"
            @click="stepNo = 4"
          >
            Next
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </v-stepper-content>

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="4"
          color="success"
          class="font-weight-medium"
        >
          Conditions
          <small>{{ isConditionsBlockShowed() ? 'Please specify your conditions' : 'No condition needed!' }}</small>
        </v-stepper-step>

        <v-stepper-content step="4">
          <div v-if="isConditionsBlockShowed()" class="mr-5">
            <v-select
              dense
              outlined
              hide-details
              label="Position"
              class="my-3"
              v-model="form.certainPosition"
              :items="positions[form.topic]"
              item-text="text"
              item-value="value"
              :menu-props="{ bottom: true, offsetY: true }"
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
            @click="stepNo = 3"
          >
            <v-icon>mdi-menu-left</v-icon>
            Prev
          </v-btn>
        </v-stepper-content>
      </v-stepper>

      <v-divider></v-divider>

      <v-card-actions class="justify-space-between pa-3">
        <span class="caption red--text">{{ problem ? problem : '' }}</span>
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

const topics = [
  { text: 'Products', value: 'PRODUCT' },
  { text: 'Links', value: 'LINK' }
];

const subjects = {
  LINK:  [
    { text: 'Status', value: 'POSITION' },
    { text: 'Price', value: 'PRICE' }
  ],
  PRODUCT: [
    { text: 'Position', value: 'POSITION' },
    { text: 'Min. Price',  value: 'MINIMUM' },
    { text: 'Avg. Price',  value: 'AVERAGE' },
    { text: 'Max. Price',  value: 'MAXIMUM' }
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
        topic: 'PRODUCT',
        subject: 'POSITION',
        subjectWhen: 'CHANGED',
        certainPosition: null,
        amountLowerLimit: 0,
        amountUpperLimit: 0,
      },
      hint: {
        amountLowerLimit: null,
        amountUpperLimit: null,
      },
      stepNo: 1,
      topics,
      subjects,
      positions,
      whens,
      problem: null,
    };
  },
  computed: {
    whenText() {
      if (this.form) {
        return this.form.subjectWhen ? this.form.subjectWhen.replaceAll('_', ' ') : this.form.subjectWhen;
      }
      return '';
    }
  },
  methods: {
    open(data) {
      this.show = true;
      if (data) {
        this.form = data;
        if (data.id) this.stepNo = 4;
      } else {
        this.form.id = null;
        this.form.topic = 'PRODUCT';
        this.form.subject = 'POSITION';
        this.form.subjectWhen = 'CHANGED';
        this.form.certainPosition = null;
        this.form.amountLowerLimit = 0;
        this.form.amountUpperLimit = 0;
        this.hint.amountLowerLimit = null;
        this.hint.amountUpperLimit = null;
      }
      this.$nextTick(() => this.formatPrices());
    },
    save() {
      if (this.isFormValid) {
        this.$emit('saved', this.form);
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
    close() {
      this.show = false;
    },
    formatPrices() {
      this.form.amountLowerLimit = parseFloat(('0' + this.form.amountLowerLimit).replace(/[^\d.]/g, '')).toFixed(2);
      this.form.amountUpperLimit = parseFloat(('0' + this.form.amountUpperLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    isConditionsBlockShowed() {
      return (this.form.subject == 'POSITION' && this.form.subjectWhen != 'CHANGED') || (this.form.subject != 'POSITION' && this.form.subjectWhen == 'OUT_OF_LIMITS');
    },
    resetSubject() {
      this.form.subject = 'POSITION';
      this.form.subjectWhen = 'CHANGED';
    },
    resetSubjectWhen() {
      if (this.form.subject == 'POSITION') {
        this.form.subjectWhen = 'CHANGED';
      } else {
        this.form.subjectWhen = 'INCREASED';
      }
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