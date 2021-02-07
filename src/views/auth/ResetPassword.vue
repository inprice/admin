<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="140" />
      </div>

      <v-card>
        <v-card-title class="form-title elevation-1 mb-2">Reset Password</v-card-title>

        <v-card-text>
          <v-form 
            ref="form"
            v-model="valid"
            onSubmit="return false"
            @keyup.native.enter="valid && submit($event)"
          >
            <v-text-field
              autofocus
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
              block
              color="info"
              class="mt-2"
              @click="submit" 
              :loading="loading" 
              :disabled="loading">Submit</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
      
      <div class="text-center font-weight-light mt-6">
        Remember your password? <router-link to="/login">Sign In</router-link>
      </div>

    </div>
  </div>
</template>

<script>
import AuthService from '@/service/auth';

export default {
  data() {
    return {
      loading: false,
      valid: false,
      showPass1: false,
      showPass2: false,
      rules: {},
      form: {
        password: '',
        repeatPassword: '',
        token: ''
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
        default: return '16%';
      }
    }
  },
  methods: {
    async submit() {
      if (!this.form.token) {
        this.$store.commit('snackbar/setMessage', { text: 'Invalid token!' });
        return
      }
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await AuthService.resetPassword(this.form);
        if (result == true) {
          this.$router.push('/login');
          this.$store.commit('snackbar/setMessage', { text: 'Your password has been successfully reset' });
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        password: [
          v => !!v || "Password required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password required",
          v => v === this.form.password || "Passwords must be the same"
        ],
      }
    }
  },
  created() {
    this.form.token = this.$route.query.token;
  }
};
</script>

<style scoped>
  .form-title {
    padding: 0 10px;
    height: 50px;
    background-color: #f3f3f3;
  }
</style>