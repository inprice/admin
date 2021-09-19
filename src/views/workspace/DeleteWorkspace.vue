<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="justify-space-between">
        <div>
          <v-icon color="red" class="mr-4 hidden-xs-only">mdi-alert-decagram-outline</v-icon>
          Deleting this workspace!
        </div>
        <v-btn
          small
          color="error" 
          class="my-auto"
          @click="openPasswordConfirmDialog"
          :loading="loading" 
          :disabled="$store.get('session/isNotAdmin') || (loading && CURSTAT.isSubscriber == false)"
        >
          Delete Workspace
        </v-btn>
       </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <div class="black--text">
          <span class="body-1">Please keep in mind the followings</span>
          <ul class="mt-2">
            <li>Are you absolutely sure? If so, in opening dialog, please provide your password to delete this workspace.</li>
            <li>Once you delete a workspace, there is no going back. All your data is permanently deleted. Please be certain.</li>
            <li>You cannot delete your workspace while you have an active subscription. To proceed, you need to cancel your subscription first.</li>
          </ul>
        </div>
      </v-card-text>
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
