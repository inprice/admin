<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="200" />
      </div>

      <v-card class="pa-3 mb-10 body-2" :color="successful ? 'green lighten-5' : 'yellow lighten-5'">

        <div v-if="successful">
          <div class="title text-center mb-2">Please check your email</div>
          <v-divider></v-divider>
          <p class="ma-4">
            An email with password reset instructions has been sent to the email address below.
          </p>
        </div>
        <div v-else>
          <div class="title text-center mb-2">Forgot password</div>
          <v-divider></v-divider>
          <p class="ma-4 small-font">
            Please provide your email address that you used when you signed up for your inprice account. We will send
            you an email that will allow you to reset your password.
          </p>
        </div>

      </v-card>

      <v-form 
        ref="form"
        v-model="valid"
        onSubmit="return false"
        @keyup.native.enter="valid && submit($event)"
      >
        <v-text-field
          outlined dense
          v-model="form.email"
          :rules="rules.email"
          label="E-mail"
          type="email"
          maxlength="100"
        />
      </v-form>

      <v-btn 
        block
        color="success"
        class="mt-2"
        @click="submit" 
        :loading="loading" 
        :disabled="loading">Submit</v-btn>

      <div class="mt-4 d-flex justify-space-between">
        <span class="small-font">Remember your password?</span>
        <router-link to="login" tabindex="-1" class="small-font">Sign in</router-link>
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
      successful: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        email: ''
      },
      verticalBrand: require('@/assets/app/brand-horCL.svg')
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
        this.successful = false;
        await AuthService.forgotPassword(this.form.email);
        this.successful = true;
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        email: [
          v => !!v || "E-mail required",
          v => (v.length >= 9 && v.length <= 100) || "Email must be between 9-100 chars",
          v => Utility.verifyEmail(v) || "E-mail must be valid"
        ],
      }
    }
  },
};
</script>
