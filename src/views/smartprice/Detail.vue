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
        <span class="body-2" v-show="!testPanelOpened">Please test your definition before save!</span>
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
        <v-card-text class="mb-2 pb-0">
          <div class="title">
            Test Results
          </div>
          <p v-show="!testProblem">
            For simplicity, the Minimum value is taken $100.00, Average $200.00 and Maximum $300.00
          </p>

          <div v-if="testProblem" class="mt-2">
            <div class="font-weight-bold">
              Error:
            </div>
            <p>
              {{ testProblem }}
            </p>
          </div>

          <table v-if="testResults" class="var-table narrow-line text-center">
            <thead>
              <tr>
                <th class="large-th text-center">When the Price</th>
                <th class="large-th text-center">Suggested Price</th>
                <th class="large-th text-center hidden-xs-only">Lower Limit</th>
                <th class="large-th text-center hidden-xs-only">Upper Limit</th>
              </tr>
            </thead>
            <tr v-for="(price, index) in instantPrices" :key="index">
              <th class="large-th text-center">{{ price }}</th>
              <td style="color: darkgreen; font-weight: 500"><i>&#36;{{ testResults[index].value | toPrice }}</i></td>
              <td class="hidden-xs-only"><i>&#36;{{ testResults[index].lowerLimit | toPrice }}</i></td>
              <td class="hidden-xs-only"><i>&#36;{{ testResults[index].upperLimit | toPrice }}</i></td>
            </tr>
          </table>
        </v-card-text>

        <v-card-actions class="pa-3 pb-4 justify-end">
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
      <div class="title">
        The formulas
      </div>
      <div class="body-2 mb-3">
        Formulas can also be constant values, such as 250.10 or 60.25
      </div>

      <table class="var-table">
        <tr>
          <th class="large-th">Formula</th>
          <td>The main formula and is used to calculate the <i>Suggested Price</i></td>
        </tr>
        <tr>
          <th class="large-th">Lower Limit</th>
          <td>Optional. Lower bound. <i>Suggested Price</i> cannot be less than this.</td>
        </tr>
        <tr>
          <th class="large-th">Upper Limit</th>
          <td>Optional. Upper bound. <i>Suggested Price</i> cannot be less than this.</td>
        </tr>
      </table>
    </div>

    <div class="mt-5">
      <div class="title">
        The factors
      </div>
      <div class="body-2 mb-3">
        To make your formulas dynamic, you need to design them with the following variables.
      </div>

      <table class="var-table">
        <tr>
          <th>p</th>
          <td>Represents <i>Your Product Price</i></td>
        </tr>
        <tr>
          <th>b</th>
          <td><i>Product Base Price</i></td>
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
      <div class="body-2 mb-3">
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

    <div class="my-5">
      <div class="title">
        Built-in functions
      </div>
      <div class="body-2 mb-3">
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

    <div class="my-5">
      <div class="title">
        Good formulas
      </div>

      <table class="var-table mt-2">
        <tr>
          <td class="formula-col">100.25</td>
          <td>A constant value.</td>
        </tr>
        <tr>
          <td class="formula-col">a/2</td>
          <td>Half of the Average.</td>
        </tr>
        <tr>
          <td class="formula-col">b + (i % 3)</td>
          <td>The Price plus remainder of dividing the Minimum by three.</td>
        </tr>
        <tr>
          <td class="formula-col">(p*1.10)+0.75</td>
          <td>Ten percent more of the Price plus 75 cents.</td>
        </tr>
        <tr>
          <td class="formula-col">(b+i+x)/2.13</td>
          <td>The sum of the Minimum, Maximum and the Price then divided it by 2.13.</td>
        </tr>
        <tr>
          <td class="formula-col">min(p*1.25, x/2)</td>
          <td>Whichever is less, twenty-five percent more of the Price OR half of the Maximum.</td>
        </tr>
        <tr>
          <td class="formula-col">max(b*1.25, x/2)</td>
          <td>Whichever is more, twenty-five percent more of the Price OR half of the Maximum.</td>
        </tr>
        <tr>
          <td class="formula-col">abs((b*1.25) - (x/2))</td>
          <td>The positive value of that the subtraction of half the Maximum from twenty-five percent more than the Price.</td>
        </tr>
      </table>
    </div>

    <div class="my-5">
      <div class="title">
        Bad formulas
      </div>

      <table class="var-table mt-2">
        <tr>
          <td class="formula-col">p/0</td>
          <td>Causes division by zero!</td>
        </tr>
        <tr>
          <td class="formula-col">a+</td>
          <td>Too many operators!</td>
        </tr>
        <tr>
          <td class="formula-col">x+i,</td>
          <td>Misplaced function separator ','</td>
        </tr>
        <tr>
          <td class="formula-col">z * 0.20</td>
          <td>Unknown function or variable 'z'</td>
        </tr>
        <tr>
          <td class="formula-col">(b*1.25</td>
          <td>Parentheses problem!</td>
        </tr>
        <tr>
          <td class="formula-col">b-(b*2)</td>
          <td>Negative value problem!</td>
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
      oldFormulas: null,
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
      //to prevent unnecessary server calls
      const newFormulas = this.form.formula+this.form.lowerLimitFormula+this.form.upperLimitFormula;
      if (newFormulas != this.oldFormulas) {
        this.oldFormulas = newFormulas;
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
          });
        }
      }
      this.testPanelOpened=true;
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
    font-weight: 500;
    width: 120px;
  }

  .var-table tr {
    border-bottom: 1px solid #ddd;
  }

  .large-th {
    font-weight: 500 !important;
    text-align: left;
  }
  .narrow-line th, .narrow-line td {
    line-height: 1.5 !important;
  }

  .formula-col {
    width: 18% !important;
    text-align: right;
    font-weight: 500 !important;
  }

  @media(max-width:576px){
    .formula-col {
      width: 50% !important;
    }
  }
</style>