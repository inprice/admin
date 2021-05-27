<template>

  <div v-if="account" class="mt-3">

    <v-card>
      <div class="d-flex justify-space-between px-4 py-2 pt-4">
        <div class="d-flex">
          <v-icon class="mr-4 hidden-xs-only">mdi-card-account-details-star-outline</v-icon>
          <div class="d-inline title">{{ account.name }}</div>
        </div>

        <v-btn 
          small
          color="white"
          class="my-auto"
          @click="$router.go(-1)"
        >
          Go Back
        </v-btn>

      </div>

      <v-divider class="mt-2"></v-divider>

      <v-simple-table class="property-table pt-3 pb-2" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.name" name="Name" :value="account.name" />
            <property :valueClass="RESPROPS.properties.status" name="Status" :value="account.status" />
            <property :valueClass="RESPROPS.properties.planName" name="Plan" :value="account.plan ? account.plan.name : ''" />

            <property :valueClass="RESPROPS.properties.users" name="Numbers">
              <div class="d-flex justify-space-around">
                <div>
                  <span>User</span> : <span class="font-weight-medium red--text subtitle">{{ account.userCount }}</span>
                </div>
                <div>
                  <span>Link</span> : <span class="font-weight-medium green--text subtitle">{{ account.linkCount }}</span>
                </div>
                <div>
                  <span>Alarm</span> : <span class="font-weight-medium blue--text subtitle">{{ account.alarmCount }}</span>
                </div>
              </div>
            </property>

            <property :valueClass="RESPROPS.properties.title" name="Title" :value="account.title" />
            <property :valueClass="RESPROPS.properties.title" name="Address 1" :value="account.address1" />
            <property :valueClass="RESPROPS.properties.title" name="2" :value="account.address2" />
            <property :valueClass="RESPROPS.properties.city" name="City" :value="account.city" />
            <property :valueClass="RESPROPS.properties.city" name="Country" :value="account.country" />
            <property :valueClass="RESPROPS.properties.createdAt" name="Created At" :value="account.createdAt" />
            <tr>
              <td colspan="2">
                <v-divider></v-divider>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="text-center">
                <v-btn 
                  small dark
                  class="red"
                  v-if="account.status != 'BANNED'"
                  @click="banAccount"
                >
                  <v-icon small>mdi-close-circle</v-icon> <span class="ml-2">Ban This Account</span>
                </v-btn>
                <v-btn 
                  small dark
                  class="success"
                  v-else
                  @click="revokeAccountBan"
                >
                  <v-icon small>mdi-human-greeting</v-icon> <span class="ml-2">Revoke Account's Ban</span>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <member-list :list="memberList" @refreshed="refreshMemberList" />
    <history-list :list="historyList" @refreshed="refreshHistoryList" />
    <trans-list :list="transList"  @refreshed="refreshTransList" />

    <ban-dialog subject="Account" ref="banDialog" @banned="banned" />
    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SU_AccountService from '@/service/super/account';

export default {
  data() {
    return {
      account: null,
      memberList: [],
      historyList: [],
      transList: []
    }
  },
  methods: {
    refreshMemberList() {
      if (this.account != null) {
        SU_AccountService.fetchMemberList(this.account.xid).then((res) => {
          if (res && res.status) {
            this.memberList = res.data;
          }
        });
      }
    },
    refreshHistoryList() {
      if (this.account != null) {
        SU_AccountService.fetchHistoryList(this.account.xid).then((res) => {
          if (res && res.status) {
            this.historyList = res.data;
          }
        });
      }
    },
    refreshTransList() {
      if (this.account != null) {
        SU_AccountService.fetchTransactionList(this.account.xid).then((res) => {
          if (res && res.status) {
            this.transList = res.data;
          }
        });
      }
    },
    banAccount() {
      this.$refs.banDialog.open({ id: this.account.xid, name: this.account.name });
    },
    banned(form) {
      SU_AccountService.ban(form)
        .then((res) => {
          if (res && res.status) {
            this.$store.commit('snackbar/setMessage', { text: `${form.name} is successfully banned.` });
            this.account.preStatus = this.account.status;
            this.account.status = 'BANNED';
          }
        });
    },
    revokeAccountBan() {
      this.$refs.confirm.open('Revoke Ban', '\'s ban will be revoked. Are you sure?', this.account.name).then((confirm) => {
        if (confirm == true) {
          SU_AccountService.revokeBan(this.account.xid)
            .then((res) => {
              if (res && res.status) {
                this.$store.commit('snackbar/setMessage', { text: `${this.account.name}'s ban is successfully revoked` });
                this.account.status = this.account.preStatus;
                this.account.preStatus = 'BANNED';
              }
            });
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      const aid = this.$route.params.aid;
      SU_AccountService.fetchDetails(aid).then((res) => {
        if (res && res.status) {
          this.account = res.data.account;
          this.memberList = res.data.memberList;
          this.historyList = res.data.historyList;
          this.transList = res.data.transList;
        }
      });
    });
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { name: 'col-10', status: 'col-7', planName: 'col-7', users: 'col-7', title: 'col-10', city: 'col-7', createdAt: 'col-7' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', status: 'col-3', planName: 'col-3', users: 'col-3', title: 'col-7', city: 'col-3', createdAt: 'col-3' },
          };
        }
      }
    },
  },
  components: {
    BanDialog: () => import('../../component/BanDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    MemberList: () => import('./MemberList'),
    HistoryList: () => import('./HistoryList'),
    TransList: () => import('./TransList'),
    Property: () => import('@/component/app/Property.vue')
  }
};
</script>
