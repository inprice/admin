<template>
  <div class="mt-5">
    <v-card tile>
      <v-card-title class="py-2">
        Delete workspace
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="pt-3">
        <div class="font-weight-bold">Please keep in mind;</div>
        <ul>
          <li>Are you absolutely sure? If so, in opening dialog, please provide your password to execute the operation.</li>
          <li>Once you delete a workspace, there is no going back! All your data is permanently deleted. Please be certain!</li>
          <li>You cannot delete your workspace while you have an active subscription. To proceed, you need to cancel it first.</li>
        </ul>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn
          small
          :loading="loading" 
          @click="openPasswordConfirmDialog"
          :disabled="$store.get('session/isNotAdmin') || (loading && CURSTAT.isSubscriber == false)"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>

    <password-confirm-dialog ref="passwordConfirmDialog" @confirmed="confirmed"/>

  </div>
</template>

<script>
import WorkspaceService from '@/service/workspace';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
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
      const result = await WorkspaceService.deleteWorkspace(password);
      if (result == true) {
        this.$refs.passwordConfirmDialog.close();
        this.$store.dispatch('session/logout', false);
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
