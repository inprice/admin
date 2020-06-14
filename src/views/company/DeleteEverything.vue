<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon color="red" class="mr-4">mdi-alert-outline</v-icon>
        <div>
          <div>Delete this company</div>
        </div>
       </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list >

          <v-list-item @click="1">
            <v-list-item-content>
              <div>Are you absolutely sure? If so, in opening dialog, please provide your password to delete this company.</div>
              <div>Once you delete a company, there is no going back. All your data is permanently deleted. Please be certain.</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn 
                small
                color="error" 
                @click="openPasswordConfirmDialog"
                :loading="loading" 
                :disabled="loading">Delete Company</v-btn>
            </v-list-item-action>
          </v-list-item>

        </v-list>

      </v-card-text>
    </v-card>

    <PasswordConfirmDialog ref="passwordConfirmDialog" @confirmed="confirmed"/>

  </div>
</template>

<script>
import CompanyService from '@/service/company';

export default {
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    openPasswordConfirmDialog() {
      this.$refs.passwordConfirmDialog.open();
    },
    async confirmed(password) {
      const result = await CompanyService.deleteEverything(password);
      if (result == true) {
        this.$refs.passwordConfirmDialog.close();
        this.$store.dispatch('auth/logout', false);
      } else {
        this.$refs.passwordConfirmDialog.stopLoading();
      }
    },
  },
  components: {
    PasswordConfirmDialog: () => import('@/component/PasswordConfirm.vue')
  }
}
</script>
