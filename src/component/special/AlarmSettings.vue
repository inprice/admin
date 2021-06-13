<template>
  <v-card>
    <v-card-text>

      <block-message dense class="mx-3">
        <b>In order to be informed immediately</b> about status or amount changes on this {{ subject }}, please specify a subject and conditions below.
      </block-message>

      <v-container fluid>
        <v-row>
          <v-col
            cols="8"
            sm="4"
            md="4"
          >
            <div class="col-title">
              <v-icon class="mr-2">mdi-checkbox-marked-circle-outline</v-icon> Subject
            </div>
            <v-radio-group
              column
              dense
              hide-details
              v-model="form.subject"
              class="col-group caption"
            >
              <v-radio
                v-for="(sub, ix) in subjects[subject]" :key="ix"
                :value="sub"
                :label="sub.toLowerCase()"
                class="text-capitalize"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <v-col
            cols="8"
            sm="4"
            md="4"
          >
            <div class="col-title">
              <v-icon class="mr-2">mdi-calendar-clock</v-icon> When
            </div>
            <v-radio-group
              column
              dense
              hide-details
              v-model="form.when"
              class="col-group"
            >
              <v-radio
                v-for="(whn, ix) in findWhens()" :key="ix"
                :value="whn"
                :label="whn.toLowerCase().replaceAll('_', ' ')"
                class="text-capitalize"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <v-col
            cols="8"
            sm="4"
            md="4"
          >
            <div class="col-title">
              <v-icon class="mr-2">mdi-counter</v-icon> Conditions
            </div>

            <div class="col-group pt-2">
              <v-text-field
                dense
                outlined
                label="Certain Status"
                v-model="form.certainStatus"
                :hint="hint.certainStatus"
                v-if="form.subject == 'STATUS' && form.when != 'CHANGED'"
              ></v-text-field>

              <div v-else>
                <v-text-field
                  dense
                  outlined
                  label="Lower Limit"
                  v-model="form.priceLowerLimit"
                  :hint="hint.priceLowerLimit"
                  @blur="formatPriceLowerLimit"
                  maxlength="10"
                  type="number"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  label="Upper Limit"
                  v-model="form.priceUpperLimit"
                  :hint="hint.priceUpperLimit"
                  @blur="formatPriceUpperLimit"
                  maxlength="10"
                  type="number"
                ></v-text-field>
              </div>
            </div>
          </v-col>

        </v-row>

      </v-container>

      <div class="d-flex pt-6 justify-center">
        <v-btn
          small
          tabindex="-1"
          @click="cancel"
          class="mr-1"
          :disabled="$store.get('session/isNotEditor')"
        >
          Cancel
        </v-btn>
        <v-btn
          small
          @click="save"
          class="ml-1"
          color="success"
          :disabled="$store.get('session/isNotEditor')"
        >
          Save
        </v-btn>
      </div>

    </v-card-text>
  </v-card>
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
  props: {
    subject: {
      type: String,
      default: 'link',
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        subject: subjects[this.subject][0],
        when: whens.status[0],
        certainStatus: null,
        priceLowerLimit: 0,
        priceUpperLimit: 0,
      },
      hint: {
        certainStatus: null,
        priceLowerLimit: null,
        priceUpperLimit: null,
      },
      subjects,
      whens,
    }
  },
  methods: {
    save() {
      this.$emit('saved', this.form);
    },
    cancel() {
      console.log('Cancel btn is clicked!');
    },
    formatPriceLowerLimit() {
      this.form.priceLowerLimit = parseFloat(('0' + this.form.priceLowerLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    formatPriceUpperLimit() {
      this.form.priceUpperLimit = parseFloat(('0' + this.form.priceUpperLimit).replace(/[^\d.]/g, '')).toFixed(2);
    },
    findWhens() {
      return this.whens[this.form.subject == 'STATUS' ? 'status' : 'price'];
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>

<style scoped>
  .col-title {
    border: 1px solid #bbb;
    box-shadow: 1px 2px #888888;
    background-color: #f9f9f9;
    padding: 5px 7px;
    border-radius: 2px;
    font-weight: 500;
  }
  .col-group {
    border: 1px solid #bbb;
    padding: 5px;
    margin-top: 0;
    height: 100%;
  }
</style>