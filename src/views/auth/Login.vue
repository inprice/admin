<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div style="width: 400px">

      <div class="text-center">
        <img :src="verticalBrand" :width="200" />
      </div>

      <v-card class="pb-0 elevation-0">
        <div class="text-center pt-4">Please sign in to your workspace</div>

        <v-card-text>
          <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent
            @keyup.native.enter="valid && submit($event)"
          >
            <v-text-field
              outlined dense
              label="E-mail"
              v-model="form.email"
              :rules="rules.email"
              type="email"
              maxlength="100"
            />

            <v-text-field
              outlined dense
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
              block
              color="success"
              @click="submit" 
              :loading="loading" 
              :disabled="loading">
                Sign In
            </v-btn>
          </v-card-actions>

          <div class="d-flex mt-5 justify-space-between">
            <router-link to="forgot-password" tabindex="-1">Forgot Password?</router-link>
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
      loading: false,
      valid: false,
      showPass: false,
      rules: {},
      form: {
        email: "",
        password: ""
      },
      verticalBrand: require('@/assets/app/brand-horCL.svg')
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await this.$store.dispatch('session/login', this.form);

        if (result.status && result.data) {
          const resData = result.data;
          let ses = resData.sessions[resData.sessionNo];
          if (ses) {
            ses = resData.sessions[0];
            this.$store.commit('session/SET_CURRENT', ses);

            if (resData.isPriviledge) {
              this.$router.push({ name: 'sys-dashboard', params: { sid: 0 } });
            } else {
              if (ses.planName) {
                if (ses.linkCount > 0) {
                  this.$router.push({ name: 'dashboard', params: { sid: resData.sessionNo } });
                } else {
                  this.$router.push({ name: 'welcome', params: { sid: resData.sessionNo } });
                }
              } else {
                this.$router.push({ name: 'welcome', params: { sid: resData.sessionNo } });
              }
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
          v => (v.length >= 6 && v.length <= 16) || "Password must be between 6-16 chars",
        ],
      }
    }
  },
  mounted() {
    this.$nextTick(() => Utility.removeTabIndexFromIconButtons(this.$el));

    const message = this.$route.query.m;
    switch (message) {
      case '1nqq':
        this.$store.commit('snackbar/setMessage', { text: 'Your session expired. Please login again.' });
        break;
    }
  }
};
</script>
