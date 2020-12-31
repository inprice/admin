<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="3">

        <div class="text-center mb-8">
          <img :src="verticalBrand" :width="140" />
        </div>

        <v-card>
          <v-card-title>Reset Password</v-card-title>

          <v-divider></v-divider>

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

            <v-card-actions>
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

      </v-col>
    </v-row>
  </v-container>
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
          v => !!v || "Password is required",
          v => (v.length >= 4 && v.length <= 16) || "Password must be between 4-16 chars",
        ],
        repeatPassword: [
          v => !!v || "Repeat Password is required",
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
