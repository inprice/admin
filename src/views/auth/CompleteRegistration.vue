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
              An email with an activation code has been sent to your email address.
              Please copy and paste the code in to the input box below to complete your registration.
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
            ref="code"
            v-model="form.code"
            :rules="rules.code"
            label="Activation Code"
            maxlenght="36"
          />
        </v-form>

        <v-btn 
          block
          color="info"
          class="mt-2"
          @click="submit" 
          :loading="loading" 
          :disabled="loading">Sign Up</v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from '@/service/auth-service';
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
          this.$router.push({ name: 'dashboard' });
          Utility.showInfoMessage('Registration Completion', 'Congrats, you have successfuly registered your company.')
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Code is required",
          v => /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i.test(v) || "Code must be valid"
        ],
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.code.focus());
  }
};
</script>
