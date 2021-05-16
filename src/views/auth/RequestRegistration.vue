<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="140" />
      </div>

      <v-card class="pb-0" tile>
        <v-card-title class="form-title elevation-1 mb-2">Register</v-card-title>

        <v-card-text>
          <v-form 
            ref="form"
            v-model="valid"
            onSubmit="return false"
            @keyup.native.enter="valid && submit($event)"
          >
            <v-text-field
              autofocus
              label="Account Name"
              v-model="form.accountName"
              :rules="rules.accountName"
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

          <v-card-actions class="px-0">
            <v-btn 
              large
              block
              color="info" 
              @click="submit" 
              :loading="loading" 
              :disabled="loading">Sign Up</v-btn>
          </v-card-actions>

          <div class="d-flex mt-5 justify-space-between">
            <router-link to="forgot-password" tabindex="-1">Forgot Password?</router-link>
            <router-link to="login" tabindex="-1">Sign In</router-link>
          </div>
        </v-card-text>
      </v-card>

      <div class="text-center font-weight-light mt-6">
        By clicking "Sign Up", you agree to <a tabindex="-1">our terms of service and privacy policy</a> We’ll occasionally send you account related emails.
      </div>

    </div>
  </div>
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
        accountName: '',
        password: '',
        repeatPassword: ''
      },
      verticalBrand: require('@/assets/app/brand-verC.svg')
    };
  },
  computed: {
    findWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '90%';
        case 'sm': return '60%';
        case 'md': return '45%';
        case 'lg': return '27%';
        default: return '18%';
      }
    }
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
        accountName: [
          v => !!v || "Account name required",
          v => (v.length >= 3 && v.length <= 70) || "Account name must be between 3-70 chars"
        ],
        email: [
          v => !!v || "E-mail required",
          v => (v.length >= 9 && v.length <= 100) || "Email must be between 9-100 chars",
          v => Utility.verifyEmail(v) || "E-mail must be valid"
        ],
        password: [
          v => !!v || "Password required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password required",
          v => v === this.form.password || "Passwords must be the same"
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => Utility.removeTabIndexFromIconButtons(this.$el));
  }
};
</script>

<style scoped>
  .form-title {
    padding: 0 10px;
    height: 50px;
    color: #606060;
    background-color: #f8f8f8;
  }
</style>