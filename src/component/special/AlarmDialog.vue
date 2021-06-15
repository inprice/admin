<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      :max-width="findDialogWidth"
      overlay-opacity="0.2"
    >
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <div>
            <div>{{ form.id ? 'Edit' : 'New' }} Alarm</div>
            <div class="caption">For {{ name }}</div>
          </div>
          <v-btn icon class="my-auto" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-stepper
          vertical
          v-model="stepNo"
        >
          <v-stepper-step
            editable
            step="1"
            color="success"
          >
            Subject
            <small class="caption">For which subject: <b>{{ form.subject }}</b></small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-radio-group
              dense
              @change="onSubjectChanged"
              v-model="form.subject"
            >
              <v-radio
                v-for="(sub, ix) in subjects[forWhich]" :key="ix"
                class="text-capitalize"
                :label="sub.toLowerCase().replaceAll('_', ' ')"
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
            <small class="caption">When do you want to be informed: <b>{{ form.when.replaceAll('_', ' ') }}</b></small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-radio-group
              dense
              v-model="form.when"
            >
              <v-radio
                v-for="(whn, ix) in whenItems" :key="ix"
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

            <div
              class="pt-2 pr-4"
              v-if="isConditionsBlockShowed()"
            >
              <v-text-field
                dense
                outlined
                label="Certain Status"
                v-model="form.certainStatus"
                :messages="hint.certainStatus"
                :error="hint.certainStatus != null"
                v-if="form.subject == 'STATUS' && form.when != 'CHANGED'"
              ></v-text-field>

              <v-text-field
                dense
                outlined
                label="Lower Limit"
                v-model="form.priceLowerLimit"
                :messages="hint.priceLowerLimit"
                :error="hint.priceLowerLimit != null"
                @blur="formatPrices"
                maxlength="10"
                type="number"
                v-if="form.subject != 'STATUS' && form.when == 'OUT_OF_LIMITS'"
              ></v-text-field>
              <v-text-field
                dense
                outlined
                label="Upper Limit"
                v-model="form.priceUpperLimit"
                :messages="hint.priceUpperLimit"
                :error="hint.priceUpperLimit != null"
                @blur="formatPrices"
                maxlength="10"
                type="number"
                v-if="form.subject != 'STATUS' && form.when == 'OUT_OF_LIMITS'"
              ></v-text-field>
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
              :disabled="$store.get('session/isNotEditor') || stepNo != 3"
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
  link:  ['STATUS', 'PRICE'],
  group: ['STATUS', 'MINIMUM', 'AVERAGE', 'MAXIMUM', 'TOTAL']
};

const whens = {
  status: ['CHANGED', 'EQUAL', 'NOT_EQUAL'],
  price:  ['INCREASED', 'DECREASED', 'OUT_OF_LIMITS']
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
        when: 'CHANGED',
        certainStatus: null,
        priceLowerLimit: 0,
        priceUpperLimit: 0,
      },
      hint: {
        certainStatus: null,
        priceLowerLimit: null,
        priceUpperLimit: null,
      },
      name: null,
      forWhich: 'link',
      subjects,
      whens,
      whenItems: whens.status,
      stepNo: 1,
    };
  },
  methods: {
    open(data) {
      this.opened = true;
      if (data) {
        this.form = data;
        this.name = data.name;
      }
      this.$nextTick(() => this.formatPrices());
    },
    save() {
      this.hint.certainStatus = null;
      this.hint.priceLowerLimit = null;
      this.hint.priceUpperLimit = null;
      if (this.form.subject == 'STATUS' && this.form.when != 'CHANGED' && !this.form.certainStatus) {
        this.hint.certainStatus = 'Required';
        return false;
      }
      if (this.form.subject != 'STATUS' && this.form.when == 'OUT_OF_LIMITS') {
        if (parseFloat(this.form.priceLowerLimit) < 1) {
          this.hint.priceLowerLimit = 'Required';
          if (parseFloat(this.form.priceUpperLimit) > 0) return false;
        }
        if (parseFloat(this.form.priceUpperLimit) < 1) {
          this.hint.priceUpperLimit = 'Required';
          return false;
        }
      }

      this.$emit('saved', this.form);
      this.close();
    },
    setOff() {
      this.$emit('setOff', this.form.id);
      this.close();
    },
    close() {
      this.opened = false;
    },
    onSubjectChanged() {
      this.whenItems = whens[this.form.subject == 'STATUS' ? 'status' : 'price'];
      this.form.when = this.whenItems[0];
    },
    formatPrices() {
      this.form.priceLowerLimit = parseFloat(('0' + this.form.priceLowerLimit).replace(/[^\d.]/g, '')).toFixed(2);
      this.form.priceUpperLimit = parseFloat(('0' + this.form.priceUpperLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    isConditionsBlockShowed() {
      return (this.form.subject == 'STATUS' && this.form.when != 'CHANGED') || (this.form.subject != 'STATUS' && this.form.when == 'OUT_OF_LIMITS');
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  }
};
</script>

<style scoped>
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
</style>