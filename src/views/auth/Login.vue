<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3" xl="2">

        <v-alert dense dismissible type="info" v-if="infoMessage">
          {{ infoMessage }}
        </v-alert>

        <v-alert dense dismissible type="success" v-if="successMessage">
          {{ successMessage }}
        </v-alert>

        <v-alert dense dismissible type="error" v-if="errorMessage">
          {{ errorMessage }}
        </v-alert>
        
        <div class="headline text-center font-weight-medium mb-5">
          Welcome to inprice
        </div>

        <v-card>
          <v-card-title>Login</v-card-title>

          <v-divider></v-divider>

          <v-card-text>

            <v-form ref="form" v-model="valid">
              <v-text-field
                label="E-mail"
                v-model="form.email"
                ref="email"
                :rules="rules.email"
                type="email"
              />

              <v-text-field
                label="Password"
                v-model="form.password"
                :rules="rules.password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
              />
            </v-form>

            <v-card-actions>
              <router-link class="font-weight-light" to="forgot-password">Forgot Password?</router-link>
              <v-spacer></v-spacer>
              <v-btn 
                color="info" 
                @click="submit" 
                :loading="loading" 
                :disabled="loading">Sign In</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
        <div class="text-center font-weight-light mt-6">
          Don't have an account yet? <router-link to="register">Sign Up</router-link>
        </div>
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
      infoMessage: null,
      successMessage: null,
      errorMessage: null,

      loading: false,
      valid: false,
      showPass: false,
      rules: {},
      form: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await AuthService.login(this.form);
        if (result == true) {
          this.$router.push({ name: 'dashboard' });
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        email: [
          v => !!v || "E-mail is required",
          v => (v.length >= 9 && v.length <= 100) || "Email must be between 9-100 chars",
          v => Utility.verifyEmail(v) || "E-mail must be valid"
        ],
        password: [
          v => !!v || "Password is required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => this.$refs.email.focus());
    if (process.env.NODE_ENV == 'development') {
      this.form.email = 'mustafa@inprice.io';
      this.form.password = '1234';
    }

    this.infoMessage = null;
    this.errorMessage= null;

    const message = parseInt(this.$route.query.message || '0');
    switch (message) {
      case 1:
        this.infoMessage = "Your session expired.";
        break;
      case 2:
        this.successMessage = "Your registration is successfuly completed.";
        break;
      case 3:
        this.errorMessage = "Your registration link is invalid or expired. Please try again";
        break;
      case 4:
        this.successMessage = "You have successfuly activated your membership.";
        break;
      case 5:
        this.errorMessage = "Your activation link is invalid or expired. Please ask again";
        break;
    }
  }
};
</script>
