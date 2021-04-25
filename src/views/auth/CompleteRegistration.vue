<template>
  <div class="d-flex justify-center my-auto" :class="'py-'+($vuetify.breakpoint.smAndDown ? '8' : '0')">
    <div :style="'width: ' + findWidth">

      <div class="text-center mb-8">
        <img :src="verticalBrand" :width="140" />
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
        onSubmit="return false"
        @keyup.native.enter="valid && submit($event)"
      >

        <div class="text-center">Activation Code</div>
        <v-text-field
          autofocus
          outlined
          x-large
          v-model="form.code"
          :rules="rules.code"
          v-mask="'###-###'"
          type="text"
          class="display-1 centered-input"
          maxlength="7"
        />
      </v-form>

      <v-card-actions class="px-0">
        <v-btn 
          large
          block
          color="info"
          @click="submit" 
          :loading="loading" 
          :disabled="loading">
          Sign Up
        </v-btn>
      </v-card-actions>
      <router-link class="d-flex justify-center mt-4" to="login" :disabled="loading">Back to Login</router-link>
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
      rules: {},
      form: {
        code: ''
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
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await AuthService.completeRegistration(this.form.code.replaceAll('-', ''));
        if (result == true) {
          this.$router.push({ name: 'plans', params: { sid: 0 } });
          this.$store.commit('snackbar/setMessage', { text: 'Congrats, you have successfully registered your account.' });
          return;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        code: [
          v => !!v || "Required",
          v => (v.length == 7) || "Must be 6 chars"
        ],
      }
    }
  },
};
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center;
  }
</style>