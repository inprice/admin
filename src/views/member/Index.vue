<template>
  <div>
    <div class="display-1">
      Members
    </div>

    <p class="subtitle">
      In this section, you manage your members.
    </p>

    <p>
      Please note that you are allowed to add users up to user limit of your plan.
    </p>

    <v-btn dark color="success" class="my-4" @click="openSendDialog">
      Invite a user
    </v-btn>

    <List
      :members="rows"
      @resend="resend"
      @updateStatus="updateStatus"
      @changeRole="changeRole"
    />
    
    <Send
      ref="sendDialog"
      @send="send"
    />

  </div>
</template>

<script>
import MemberService from '@/service/member';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      rows: [],
    };
  },
  methods: {
    openSendDialog() {
      this.$refs.sendDialog.open();
    },
    async send(form) {
      const result = await MemberService.send(form);
      if (result == true) {
        this.$refs.sendDialog.close();
        this.list();
      } else {
        this.$refs.sendDialog.stopLoading();
      }
    },
    async resend(id) {
      const result = await MemberService.resend(id);
      if (result == true) {
        Utility.showShortInfoMessage('Invite Again', 'A new invitation mail is successfully sent to the member');
        this.list();
      }
    },
    async list() {
      const result = await MemberService.list();
      if (result) {
        this.rows = result;
      } else {
        this.rows = [];
      }
    },
    async changeRole(data) {
      const result = await MemberService.changeRole(data);
      if (result == true) this.list();
    },
    async updateStatus(data) {
      const result = await MemberService.updateStatus(data);
      if (result == true) this.list();
    }
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.list();
    });
  },
  components: {
    Send: () => import('./Send'),
    List: () => import('./List')
  }
};
</script>
