<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="140" />
      </div>

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

      <v-card class="pb-0" tile>
        <v-card-title class="form-title elevation-1 mb-2">Login</v-card-title>

        <v-card-text>
          <v-form 
            ref="form"
            v-model="valid"
            onSubmit="return false"
            @keyup.native.enter="valid && submit($event)"
          >
            <v-text-field
              autofocus
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

          <v-card-actions class="px-0">
            <v-btn 
              large
              block
              color="info"
              @click="submit" 
              :loading="loading" 
              :disabled="loading">Sign In</v-btn>
          </v-card-actions>

          <div class="d-flex mt-5">
            <router-link to="forgot-password" tabindex="-1">Forgot Password?</router-link>
            <v-spacer></v-spacer>
            <router-link to="request-registration" tabindex="-1">Sign Up</router-link>
          </div>
        </v-card-text>
      </v-card>

    </div>
  </div>
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
      },
      verticalBrand: require('@/assets/app/brand-verC.svg')
    };
  },
  computed: {
    findWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '90%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '16%';
      }
    }
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await this.$store.dispatch('session/login', this.form);
        if (result != null) {
          let ses = result.sessions[result.sessionNo];
          if (ses == undefined && result.sessionNo != 0 && result.sessions[0]) {
            ses = result.sessions[0];
            this.$store.commit('session/SET_CURRENT', ses, 0);
          }
          if (ses) {
            if (ses.planName) {
              if (ses.linkCount > 0) {
                this.$router.push({ name: 'dashboard', params: { sid: result.sessionNo } });
              } else {
                this.$router.push({ name: 'groups', params: { sid: result.sessionNo } });
              }
            } else {
              this.$router.push({ name: 'plans', params: { sid: result.sessionNo } });
            }
          }
        }
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
        password: [
          v => !!v || "Password required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
      }
    }
  },
  mounted() {
    this.$nextTick(() => Utility.removeTabIndexFromIconButtons(this.$el));

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
      case 'ap17':
        this.successMessage = "You have successfully activated your member. Please login.";
        break;
      case 'mqn6':
        this.errorMessage = "Your activation link is invalid or expired. Please ask again.";
        break;
    }
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