<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3" xl="2">

        <v-alert dense dismissible color="cyan lighten-2" border="left" elevation="2" colored-border type="success"
          v-if="successMessage"
        >
          {{ successMessage }}
        </v-alert>

        <v-alert dense dismissible color="purple lighten-2" border="left" elevation="2" colored-border type="info"
          v-if="infoMessage"
        >
          {{ infoMessage }}
        </v-alert>

        <v-alert dense dismissible color="orange" border="left" elevation="2" colored-border type="warning"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="headline text-center font-weight-medium mb-5">
          Welcome to inprice
        </div>

        <v-card>
          <v-card-title>Login</v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-form 
              ref="form"
              v-model="valid"
              onSubmit="return false"
              @keyup.native.enter="valid && submit($event)"
            >
              <v-text-field
                ref="email"
                label="E-mail"
                v-model="form.email"
                :rules="rules.email"
                type="email"
                maxlength="100"
              />

              <v-text-field
                label="Password"
                v-model="form.password"
                :rules="rules.password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                maxlength="16"
              />
            </v-form>

            <v-card-actions>
              <router-link class="font-weight-light" to="forgot-password" tabindex="-1">Forgot Password?</router-link>
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
          Don't have an account yet? <router-link to="request-registration">Sign Up</router-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
        const result = await this.$store.dispatch('auth/login', this.form);
        if (result != null) {
          this.$router.push({ name: 'dashboard', params: { sid: result } });
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
    Utility.doubleRaf(() => {
      this.$refs.email.focus();
      Utility.removeTabIndexFromIconButtons(this.$el);
    });
    if (process.env.NODE_ENV == 'development') {
      this.form.email = 'dumlupinar01@gmail.com';
      this.form.password = '1234';
    }

    this.infoMessage = null;
    this.errorMessage= null;

    const message = this.$route.query.m;
    switch (message) {
      case '1nqq':
        this.infoMessage = "Your session expired. Please login again.";
        break;
      case 'plfw':
        this.successMessage = 'We have just sent an activation link to your email address. Please check it.';
        break;
      // case 'ax37':
      //   this.successMessage = "Your registration is successfully completed. Please login.";
      //   break;
      // case 'qb41':
      //   this.infoMessage = "Your registration link is invalid or expired. Please try again.";
      //   break;
      case 'ap17':
        this.successMessage = "You have successfully activated your membership. Please login.";
        break;
      case 'mqn6':
        this.errorMessage = "Your activation link is invalid or expired. Please ask again.";
        break;
    }
  }
};
</script>
