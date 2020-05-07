<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <div class="headline text-center font-weight-medium mb-5">
          inprice
        </div>
        <v-card>

          <v-form 
            ref="form"
            v-model="valid"
            onSubmit="return false"
            @keyup.native.enter="valid && submit($event)"
          >
            <p class="text-center pt-4 ma-0">In order to register, please give your info below</p>

            <v-card-title class="pb-0">Your info</v-card-title>

            <v-card class="ma-3">

              <v-text-field class="mx-5"
                ref="userName"
                label="User Name"
                v-model="form.userName"
                :rules="rules.userName"
                type="text"
                maxlength="70"
              />

              <v-text-field class="mx-5"
                label="E-mail"
                v-model="form.email"
                type="email"
                :rules="rules.email"
                maxlength="100"
              />

              <v-text-field class="mx-5"
                label="Company Name"
                v-model="form.companyName"
                :rules="rules.companyName"
                type="text"
                maxlength="70"
              />

              <v-select class="mx-5"
                label="Timezone"
                v-model="form.timezone"
                :items="timezonesectors"
              />

              <v-text-field class="mx-5"
                label="Password"
                v-model="form.password"
                :rules="rules.password"
                :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass1 ? 'text' : 'password'"
                @click:append="showPass1 = !showPass1"
                maxlength="16"
              />

              <v-text-field class="mx-5"
                label="Repeat Password"
                v-model="form.repeatPassword"
                :rules="rules.repeatPassword"
                :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass2 ? 'text' : 'password'"
                @click:append="showPass2 = !showPass2"
                maxlength="16"
              />
            </v-card>

          </v-form>

          <v-card-actions>
            <div class="font-weight-light">
              Already have an account? 
              <router-link to="login">Sign In</router-link>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              color="info"
              @click="submit"
              :loading="loading" 
              :disabled="loading">
              Next
            </v-btn>
          </v-card-actions>
        </v-card>

        <div class="text-center font-weight-light mt-6">
          By clicking "Sign Up", you agree to <a tabindex="-1">our terms of service and privacy policy</a> We’ll occasionally send you account related emails.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import AuthService from '@/service/auth';
import Utility from '@/helpers/utility';
import timezones from '@/data/timezones';
import SystemConsts from '@/data/system';
import currencyFormats from '@/data/currency-formats';

export default {
  data() {
    return {
      valid:false,
      loading: false,
      showPass1: false,
      showPass2: false,
      rules: {},
      timezones: timezones,
      form: {
        userName: '',
        email: '',
        companyName: '',
        timezone: '',
        currencyFormat: '#,##.00;-#,##.00',
        password: '',
        repeatPassword: ''
      }
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await AuthService.requestRegistration(this.form);
        if (result == true) {
          this.$router.push('/complete-registration');
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        userName: [
          v => !!v || "User name is required",
          v => (v.length >= 3 && v.length <= 70) || "User name must be between 3-70 chars"
        ],
        email: [
          v => !!v || "E-mail is required",
          v => (v.length >= 9 && v.length <= 100) || "Email must be between 9-100 chars",
          v => Utility.verifyEmail(v) || "E-mail must be valid"
        ],
        companyName: [
          v => !!v || "Company name is required",
          v => (v.length >= 3 && v.length <= 70) || "Company name must be between 3-70 chars"
        ],
        timezone: [
          v => !!v || "Timezone is required",
        ],
        password: [
          v => !!v || "Password is required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password is required",
          v => v === this.form.password || "Passwords must be the same"
        ]
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.userName.focus());

    axios.get('https://api.ipgeolocation.io/timezone', {
        fields: 'currency,time_zone',
        apiKey: SystemConsts.system.GEO_LOCATION_API_KEY
      }).then(res => {
        if (res) {
          this.form.timezone = res.time_zone.name;
          this.form.currencyFormat = currencyFormats[res.currency.code];
          console.info('geo location api response', res);
        }
      }).catch(err => {
        console.error(err);
      });
  }
};
</script>
