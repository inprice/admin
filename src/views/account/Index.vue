<template>
  <div>
    <div class="d-flex my-3">
      <div class="title">{{ CURSTAT.account }}</div>
      <v-spacer></v-spacer>
      <v-btn 
        small
        :disabled="$store.get('session/isNotAdmin')"
        @click="openAccountInfoDialog"
      >
        Edit
      </v-btn>
    </div>

    <v-card class="mt-5">
      <v-card-title class="justify-space-between">
        <div>
          <v-icon color="green" class="mr-4 hidden-xs-only">mdi-folder-plus-outline</v-icon>
          Create a new account
        </div>
        <v-btn
          small
          class="my-auto"
          @click="openCreateAccount"
        >
          Create
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="body-2 black--text">
        Use this section when you need an extra account. <br/> And please keep in mind, you will be able to see newly created account after sign in again.
      </v-card-text>
    </v-card>

    <users></users>

    <delete-account></delete-account>

    <account-info-dialog ref="accountInfoDialog"></account-info-dialog>

  </div>
</template>

<script>
import AccountService from '@/service/account';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    async openAccountInfoDialog() {
      const result = await AccountService.get();
      if (result) {
        this.$refs.accountInfoDialog.edit(result, false);
      }
    },
    openCreateAccount() {
      this.$refs.accountInfoDialog.edit(null, true);
    },
  },
  components: {
    Users: () => import('./Users'),
    DeleteAccount: () => import('./DeleteAccount'),
    AccountInfoDialog: () => import('./AccountInfo.vue'),
  }
};
</script>