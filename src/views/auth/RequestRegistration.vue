<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3" xl="2">

        <div class="text-center mb-8">
          <img :src="verticalBrand" :width="140" />
        </div>

        <v-card>
          <v-card-title>Register</v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-form 
              ref="form"
              v-model="valid"
              onSubmit="return false"
              @keyup.native.enter="valid && submit($event)"
            >
              <v-text-field
                ref="companyName"
                label="Company Name"
                v-model="form.companyName"
                :rules="rules.companyName"
                type="text"
                maxlength="70"
              />

              <v-text-field
                label="E-mail"
                v-model="form.email"
                type="email"
                :rules="rules.email"
                maxlength="100"
              />

              <v-text-field
                label="Password"
                v-model="form.password"
                :rules="rules.password"
                :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass1 ? 'text' : 'password'"
                @click:append="showPass1 = !showPass1"
                maxlength="16"
              />

              <v-text-field
                label="Repeat Password"
                v-model="form.repeatPassword"
                :rules="rules.repeatPassword"
                :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass2 ? 'text' : 'password'"
                @click:append="showPass2 = !showPass2"
                maxlength="16"
              />

            </v-form>
          </v-card-text>

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
              Sign Up
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
import AuthService from '@/service/auth';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      valid:false,
      loading: false,
      showPass1: false,
      showPass2: false,
      rules: {},
      form: {
        email: '',
        companyName: '',
        password: '',
        repeatPassword: ''
      },
      verticalBrand: require('@/assets/app/brand-verC.svg')
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
        companyName: [
          v => !!v || "Company name is required",
          v => (v.length >= 3 && v.length <= 70) || "Company name must be between 3-70 chars"
        ],
        email: [
          v => !!v || "E-mail is required",
          v => (v.length >= 9 && v.length <= 100) || "Email must be between 9-100 chars",
          v => Utility.verifyEmail(v) || "E-mail must be valid"
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
    Utility.doubleRaf(() => {
      this.$refs.companyName.focus();
      Utility.removeTabIndexFromIconButtons(this.$el);
    });
  }
};
</script>
