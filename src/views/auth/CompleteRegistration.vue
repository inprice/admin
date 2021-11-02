<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div style="width: 400px">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="200" />
      </div>

      <v-card class="pa-3 mb-8 body-2" color="yellow lighten-5">
        <div>
          <div class="title text-center mb-2">Please check your email</div>
          <v-divider></v-divider>
          <p class="ma-4">
            We have just sent an email with activation code to your email address.
            Please copy and paste the code in the input below to complete your registration.
          </p>
        </div>

      </v-card>

      <v-form 
        ref="form"
        v-model="valid"
        @submit.prevent
        @keyup.native.enter="valid && submit($event)"
      >
        <div class="text-center">Activation Code</div>

        <v-text-field
          outlined
          v-model="form.code"
          :rules="rules.code"
          v-mask="'###-###'"
          type="text"
          class="text-h4 centered-input"
          maxlength="7"
        />
      </v-form>

      <v-card-actions class="px-0">
        <v-btn 
          block large
          color="success"
          @click="submit" 
        >
          Sign Up
        </v-btn>
      </v-card-actions>
      <router-link class="d-flex justify-center mt-4" to="login">Back to Login</router-link>
    </div>

    <overlay :show="overlay" />
  </div>
</template>

<script>
import AuthService from '@/service/auth';

export default {
  data() {
    return {
      overlay: false,
      valid: false,
      rules: {},
      form: {
        code: ''
      },
      verticalBrand: require('@/assets/app/brand-horCL.svg')
    };
  },
  methods: {
    async submit() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.overlay = true;
        const result = await AuthService.completeRegistration(this.form.code.replaceAll('-', ''));
        if (result.status) {
          this.$router.push({ name: 'plans', params: { sid: 0 } });
          this.$store.commit('snackbar/setMessage', { text: 'Congrats, you have successfully registered your workspace.' });
        }
        this.overlay = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Required",
          v => (v && v.length == 7) || "Must be at least 6 chars"
        ],
      }
    }
  },
  components: {
    Overlay: () => import('@/component/app/Overlay.vue'),
  }
};
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center;
  }
</style>