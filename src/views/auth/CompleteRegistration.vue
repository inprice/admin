<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3" xl="2">
        <div class="headline text-center font-weight-medium mb-5">
          inprice
        </div>

        <v-card class="pa-3 mb-10 body-2" color="yellow lighten-5">

          <div>
            <div class="text-center mb-2">Please check your email account.</div>
            <v-divider></v-divider>
            <p class="ma-4">
              We have just sent an email with activation code to your email address.
              Please copy and paste in the input below to complete your registration.
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
            ref="code"
            outlined dense
            v-model="form.code"
            :rules="rules.code"
            label="Activation Code"
            type="text"
            maxlength="32"
          />
        </v-form>

        <v-card-actions class="px-0">
          <router-link to="login" :disabled="loading">Back to Login</router-link>
          <v-spacer></v-spacer>
          <v-btn 
            color="info"
            @click="submit" 
            :loading="loading" 
            :disabled="loading">
            Sign Up
          </v-btn>
        </v-card-actions>

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
      loading: false,
      valid: false,
      rules: {},
      form: {
        code: ''
      }
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await AuthService.completeRegistration(this.form.code);
        if (result == true) {
          this.$router.push({ name: 'dashboard', params: { sid: 0 } });
          Utility.showInfoMessage('Registration Completion', 'Congrats, you have successfully registered your company.')
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Required",
          v => (v.length == 32) || "Must be 32 chars"
        ],
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.code.focus());
  }
};
</script>
