<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center">
        <img :src="verticalBrand" :width="200" />
      </div>

      <v-card class="pb-0 elevation-0">

        <v-alert
          dense
          dismissible
          outlined
          type="error"
          class="ma-4"
          v-model="showError"
        >
          {{ errorMessage }}
        </v-alert>
        <div v-if="!showError" class="text-center ma-4 font-weight-light">Please fill this form to register your workspace</div>

        <v-card-text>
          <v-form 
            ref="form"
            v-model="valid"
            onSubmit="return false"
            @keyup.native.enter="valid && submit($event)"
          >
            <v-text-field
              outlined dense
              label="Workspace Name"
              v-model="form.workspaceName"
              :rules="rules.workspaceName"
              type="text"
              maxlength="70"
            />

            <v-text-field
              outlined dense
              label="E-mail"
              v-model="form.email"
              type="email"
              :rules="rules.email"
              maxlength="100"
            />

            <v-text-field
              outlined dense
              label="Password"
              v-model="form.password"
              :rules="rules.password"
              :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass1 ? 'text' : 'password'"
              @click:append="showPass1 = !showPass1"
              maxlength="16"
            />

            <v-text-field
              outlined dense
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
              block
              color="success" 
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

      <v-divider></v-divider>

      <div class="text-center small-font mt-6">
        By clicking "Sign Up", you agree to <a tabindex="-1">our terms of service and privacy policy</a> We’ll occasionally send you workspace related emails.
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
        workspaceName: '',
        password: '',
        repeatPassword: ''
      },
      showError: false,
      errorMessage: '',
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
        const result = await AuthService.requestRegistration(this.form);
        if (result.status) {
          this.showError = false;
          this.errorMessage = '';

          this.$router.push('/complete-registration');
          return;
        } else {
          this.errorMessage = result.error;
          this.showError = true;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        workspaceName: [
          v => !!v || "Workspace name required",
          v => (v.length >= 3 && v.length <= 70) || "Workspace name must be between 3-70 chars"
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
