<template>
  <div class="mt-2">

    <div class="d-flex justify-space-between mb-3 mt-5">
      <v-btn small @click="$router.go(-1)">Back</v-btn>

      <div>
        <v-btn 
          small
          class="mr-1"
          color="error"
          @click="remove"
          :disabled="$store.get('session/isNotEditor')"
        >
          DELETE
        </v-btn>
      </div>
    </div>

    <v-card>
      <v-card-title class="pb-3">
        Definition
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form ref="form" v-model="valid" @submit.prevent>

          <v-text-field
            dense
            outlined
            label="Name"
            v-model="form.name"
            :rules="rules.name"
            type="text"
            maxlength="70"
          />

          <v-text-field
            dense
            outlined
            label="Formula"
            v-model="form.formula"
            :rules="rules.formula"
            type="text"
            maxlength="255"
          />

          <v-text-field
            dense
            outlined
            label="Lower Limit Formula"
            v-model="form.lowerLimitFormula"
            :rules="rules.lowerLimitFormula"
            type="text"
            maxlength="255"
          />

          <v-text-field
            dense
            outlined
            label="Upper Limit Formula"
            v-model="form.upperLimitFormula"
            :rules="rules.upperLimitFormula"
            type="text"
            maxlength="255"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-3 pt-0">
        <span class="small-font">You are adviced to test your definition before save!</span>
        <v-spacer></v-spacer>
        <v-btn
          small
          color="warning"
          @click="testTheForm"
          :disabled="$store.get('session/isNotEditor')"
        >
          Test
        </v-btn>

        <v-btn
          small
          @click="save"
          color="success"
          :disabled="$store.get('session/isNotEditor')"
        >
          Save
        </v-btn>
      </v-card-actions>

      <div v-show="testPanelOpened">
        <v-divider class="mt-2"></v-divider>
        <v-card-text class="my-2 pb-0">
          <div class="title">Test your definition</div>

          <div :class="{ 'd-flex': $vuetify.breakpoint.mdAndUp }">
            <div class="pb-0" :class="{ 'col-4 pl-0': $vuetify.breakpoint.mdAndUp, 'mb-2': $vuetify.breakpoint.smAndDown }">
              <p class="font-weight-medium blue--text">
                The following values will be used in tests.
              </p>
              <table class="var-table">
                <tr>
                  <th class="large-th">Minimum</th>
                  <td><i>$100.00</i></td>
                </tr>
                <tr>
                  <th class="large-th">Average</th>
                  <td><i>$200.00</i></td>
                </tr>
                <tr>
                  <th class="large-th">Maximum</th>
                  <td><i>$300.00</i></td>
                </tr>
                <tr>
                  <th class="large-th">Product Price</th>
                  <td><i>To variate test results, this value will be given in the Result Table</i></td>
                </tr>
              </table>
            </div>

            <div class="pb-0" :class="{ 'col-8 pr-0': $vuetify.breakpoint.mdAndUp, 'mt-2': $vuetify.breakpoint.smAndDown }">
              <p class="font-weight-medium blue--text">
                The Result
              </p>

              <div v-if="testProblem">
                <v-chip small label dark color="pink" class="font-weight-bold">
                  ERROR
                </v-chip>
                <p>
                  {{ testProblem }}
                </p>
              </div>

              <table v-if="testResults" class="var-table narrow-line text-center">
                <thead>
                  <tr>
                    <th>If Product Price</th>
                    <th>Suggested Price</th>
                    <th class="hidden-xs-only">Lower Limit</th>
                    <th class="hidden-xs-only">Upper Limit</th>
                  </tr>
                </thead>
                <tr v-for="(price, index) in instantPrices" :key="index">
                  <th class="large-th text-center">{{ price }}</th>
                  <td><i>&#36;{{ testResults[index].value | toPrice }}</i></td>
                  <td class="hidden-xs-only"><i>&#36;{{ testResults[index].lowerLimit | toPrice }}</i></td>
                  <td class="hidden-xs-only"><i>&#36;{{ testResults[index].upperLimit | toPrice }}</i></td>
                </tr>
              </table>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-3 justify-end">
          <v-btn
            small
            @click="testPanelOpened=false"
          >
            Close the Panel
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <div class="mt-5">
      <p class="title">
        The formulas
      </p>
      <table class="var-table">
        <tr>
          <th class="large-th">Formula</th>
          <td>The main formula used to calculate the <i>Suggested Price</i></td>
        </tr>
        <tr>
          <th class="large-th">Lower Limit</th>
          <td>Optional. This formula limits the suggested price in terms of <i>Lower Limit</i></td>
        </tr>
        <tr>
          <th class="large-th">Upper Limit</th>
          <td>Optional. This limits the suggested price in terms of <i>Upper Limit</i></td>
        </tr>
      </table>
    </div>

    <div class="mt-5">
      <div class="title">
        The factors
      </div>
      <div class="body-2 mb-5">
        To make your formulas dynamic, you need to design them with the following variables.
      </div>

      <table class="var-table">
        <tr>
          <th>p</th>
          <td>Represents <i>Your Product Price</i></td>
        </tr>
        <tr>
          <th>i</th>
          <td><i>Minimum price of your <a>active</a> competitors</i></td>
        </tr>
        <tr>
          <th>a</th>
          <td><i>Average price</i></td>
        </tr>
        <tr>
          <th>x</th>
          <td><i>Maximum price</i></td>
        </tr>
      </table>
    </div>

    <div class="mt-5">
      <div class="title">
        Operators
      </div>
      <div class="body-2 mb-5">
        How to use math operators
      </div>

      <table class="var-table">
        <tr>
          <th class="large-th">Addition</th>
          <td><i>2 + 2 = 4</i></td>
          <th class="large-th">Multiplication</th>
          <td><i>2 * 2 = 4</i></td>
        </tr>
        <tr>
          <th class="large-th">Subtraction</th>
          <td><i>2 - 1 = 1</i></td>
          <th class="large-th">Division</th>
          <td><i>4 / 2 = 2</i></td>
        </tr>
        <tr>
          <th class="large-th">Exponentation</th>
          <td><i>4 ^ 2 = 16</i></td>
          <th class="large-th">Modulo</th>
          <td><i>4 % 2 = 0</i></td>
        </tr>
      </table>
    </div>

    <div class="my-6">
      <div class="title">
        Built-in functions
      </div>
      <div class="body-2 mb-5">
        With the help of the following functions you can crate more dynamic formulas
      </div>

      <table class="var-table">
        <tr>
          <th class="large-th">min</th>
          <td>Minimum of two values -> <i><b>min</b></i>(4, 2) = 2</td>
          <th class="large-th">floor</th>
          <td>Nearest lower integer -> <i><b>floor</b></i>(3.85) = 3</td>
        </tr>
        <tr>
          <th class="large-th">max</th>
          <td>Maximum of two values -> <i><b>max</b>(4, 2) = 4</i></td>
          <th class="large-th">ceil</th>
          <td>Nearest upper integer -> <i><b>ceil</b></i>(3.05) = 4</td>
        </tr>
        <tr>
          <th class="large-th">abs</th>
          <td>Absolute value -> <i><b>abs</b></i>(2 - 4) = 2</td>
          <th class="large-th">sqrt</th>
          <td>Square root -> <i><b>sqrt</b></i>(4) = 2</td>
        </tr>
      </table>
    </div>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import SmartPriceService from '@/service/smartprice';

export default {
  data() {
    return {
      valid: false,
      rules: {},
      form: {
        name: '',
        formula: '',
        lowerLimitFormula: '',
        upperLimitFormula: '',
      },
      testResults: null,
      loading: false,
      testProblem: null,
      testPanelOpened: false,
      instantPrices: [ '$50.00', '$100.00', '$150.00', '$200.00', '$250.00', '$300.00', '$350.00' ]
    };
  },
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.form.name).then(async (confirm) => {
        if (confirm == true && this.isNumeric(this.$route.params.id)) {
          const result = await SmartPriceService.remove(this.$route.params.id);
          if (result && result.status) this.$router.go(-1);
        }
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        if (this.isNumeric(this.$route.params.id)) {
          this.form.id = this.$route.params.id;
        }
        SmartPriceService.save(this.form).then(res => {
          if (res && res.status) {
            this.$store.commit('snackbar/setMessage', { text: 'Smart price has been successfully updated' });
            if (this.isNumeric(this.$route.params.id) == false) this.$router.go(-1);
          }
        });
      }
    },
    async testTheForm() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        SmartPriceService.test(this.form).then(res => {
          if (res.data) {
            this.testProblem = null;
            this.testResults = res.data;
          } else {
            this.testResults = null;
            this.testProblem = res.error;
          }
          this.testPanelOpened=true;
        });
      }
    },
    find() {
      if (this.isNumeric(this.$route.params.id) == false) {
        return;
      }
      SmartPriceService.get(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.form = res.data;
        }
      });
    },
    activateRules() {
      this.rules = {
        name: [
          v => !!v || "Required",
          v => (v && v.length <= 255) || "Name must be less than 255 chars"
        ],
        formula: [
          v => !!v || "Required",
          v => (v && v.length <= 255) || "Name must be less than 255 chars"
        ],
        lowerLimitFormula: [
          v => (!v || v.length <= 255) || "If given, must be less than 255 chars"
        ],
        upperLimitFormula: [
          v => (!v || v.length <= 255) || "If given, must be less than 255 chars"
        ],
      }
    },
  },
  mounted() {
    this.find();
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
  },
  watch: {
    '$route.params.id': {
        handler: function() {
          this.find();
        },
      }
  },
};
</script>

<style scoped>
  .var-table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e8e8e8;
  }

  .var-table th, td {
    font-size: 14px;
    padding: 5px 10px;
    border-right: 1px solid #e8e8e8;
    vertical-align: top;
    line-height: 2.0;
  }

  .var-table th {
    background-color: #fafafa;
    color: rgba(0,0,0,.85);
    font-weight: 600;
    font-style: italic;
    width: 120px;
  }

  .var-table tr {
    border-bottom: 1px solid #ddd;
  }

  .large-th {
    font-style: normal !important;
    font-weight: 500 !important;
    text-align: left;
  }
  .narrow-line th, .narrow-line td {
    line-height: 1.5 !important;
  }
</style>