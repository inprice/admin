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

    <v-row class="mt-4">
      <v-col>
        <v-btn @click="list">
          Refresh
        </v-btn>
      </v-col>

      <v-col class="text-right">
        <v-btn dark color="success" @click="openSendDialog">
          Invite a user
        </v-btn>
      </v-col>
    </v-row>

    <List
      :members="rows"
      @resend="resend"
      @pause="pause"
      @resume="resume"
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
    async pause(id) {
      const result = await MemberService.pause(id);
      if (result == true) this.list();
    },
    async resume(id) {
      const result = await MemberService.resume(id);
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
