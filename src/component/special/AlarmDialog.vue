<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2"
      @keydown.esc="opened = false"
    >
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <div>
            <div>
              {{ form.id ? 'Edit' : 'New' }} 
              <span class="text-capitalize">{{ topic.toLowerCase() }}</span>
              Alarm
            </div>
            <div class="caption">For {{ name }}</div>
          </div>
          <v-btn icon class="my-auto" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider></v-divider>

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
            <div><small class="caption">For which subject: <b>{{ form.subject }}</b></small></div>
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
                :label="sub.toLowerCase()"
                :value="sub"
              ></v-radio>
            </v-radio-group>

            <v-btn
              small
              class="mb-3"
              @click="stepNo = 2"
            >
              Next
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
            <small class="caption text-capitalize">{{ form.subject.toLowerCase() }} is <b>{{ form.subjectWhen.replaceAll('_', ' ') }}</b></small>
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
                :label="whn.toLowerCase().replaceAll('_', ' ')"
                :value="whn"
              ></v-radio>
            </v-radio-group>

            <v-btn
              small
              class="mb-3 mr-1"
              @click="stepNo = 1"
            >
              Prev
            </v-btn>
            <v-btn
              small
              class="mb-3 ml-1"
              @click="stepNo = 3"
            >
              Next
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
                label="Status"
                v-model="form.certainStatus"
                :items="statuses"
                class="my-3"
                v-if="form.subject == 'STATUS' && form.subjectWhen != 'CHANGED'"
              ></v-select>

              <div
                class="d-flex justify-space-between mt-3"
                v-if="form.subject != 'STATUS' && form.subjectWhen == 'OUT_OF_LIMITS'"
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

            <block-message v-else dense class="mb-3 mr-4" :message="'No condition applicable!'" />

            <v-btn
              small
              class="mb-3"
              @click="stepNo = 2"
            >
              Prev
            </v-btn>
          </v-stepper-content>
        </v-stepper>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-space-between">
          <v-btn
            text
            tabindex="-1"
            color="red"
            @click="setOff"
            :disabled="!form.id"
          >
            Remove
          </v-btn>
          <div>
            <v-btn
              text
              tabindex="-1"
              @click="close"
            >
              Close
            </v-btn>
            <v-btn
              text
              @click="save"
              color="success"
              :disabled="$store.get('session/isNotEditor') || !isFormValid()"
            >
              {{ form.id ? 'Update' : 'Create' }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
const subjects = {
  LINK:  ['STATUS', 'PRICE'],
  GROUP: ['STATUS', 'MINIMUM', 'AVERAGE', 'MAXIMUM', 'TOTAL']
};

const whens = {
  status: ['CHANGED', 'EQUAL', 'NOT_EQUAL'],
  price:  ['INCREASED', 'DECREASED', 'OUT_OF_LIMITS']
};

const statuses = {
  LINK:  ['ACTIVE', 'TRYING', 'WAITING', 'PROBLEM'],
  GROUP: ['NA', 'LOWEST', 'LOWER', 'EQUAL', 'AVERAGE', 'HIGHER', 'HIGHEST']
};

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
  data() {
    return {
      opened: false,
      form: {
        id: null,
        subject: 'STATUS',
        subjectWhen: 'CHANGED',
        certainStatus: 'ACTIVE',
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
      statuses: null,
      subjectWhens: whens.status,
      stepNo: 1,
    };
  },
  methods: {
    open(data) {
      this.opened = true;
      if (data) {
        this.form = data;
        this.name = data.name;
        this.topic = data.topic;
        this.statuses = statuses[data.topic];
        this.subjectWhens = whens[this.form.subject == 'STATUS' ? 'status' : 'price'];
        this.stepNo = 3;
      }
      this.$nextTick(() => this.formatPrices());
    },
    save() {
      if (this.isFormValid) {
        this.$emit('saved', this.form);
        this.close();
      } else {
        this.hint.amountLowerLimit = null;
        this.hint.amountUpperLimit = null;
        if (this.form.subject != 'STATUS' && this.form.subjectWhen == 'OUT_OF_LIMITS') {
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
      this.opened = false;
    },
    onSubjectChanged() {
      this.subjectWhens = whens[this.form.subject == 'STATUS' ? 'status' : 'price'];
      this.form.subjectWhen = this.subjectWhens[0];
    },
    onWhenChanged() {
      if (this.form.subjectWhen == 'EQUAL' || this.form.subjectWhen == 'NOT_EQUAL') {
        this.form.certainStatus = this.statuses[0];
      }
    },
    formatPrices() {
      this.form.amountLowerLimit = parseFloat(('0' + this.form.amountLowerLimit).replace(/[^\d.]/g, '')).toFixed(2);
      this.form.amountUpperLimit = parseFloat(('0' + this.form.amountUpperLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    isConditionsBlockShowed() {
      return (this.form.subject == 'STATUS' && this.form.subjectWhen != 'CHANGED') || (this.form.subject != 'STATUS' && this.form.subjectWhen == 'OUT_OF_LIMITS');
    },
    isFormValid() {
      if (this.form.subject == 'STATUS' && this.form.subjectWhen != 'CHANGED' && !this.form.certainStatus) {
        return false;
      } else {
        if (this.form.subject != 'STATUS' && this.form.subjectWhen == 'OUT_OF_LIMITS') {
          if (parseFloat(this.form.amountLowerLimit) < 1) {
            if (parseFloat(this.form.amountUpperLimit) < 1) return false;
          }
          if (parseFloat(this.form.amountUpperLimit) < 1) {
            if (parseFloat(this.form.amountLowerLimit) < 1) return false;
          }
        }
      }
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
    margin: 0;
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