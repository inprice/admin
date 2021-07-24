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
            <property :valueClass="RESPROPS.properties.contact" name="Contact" :value="account.contactName" />
            <property :valueClass="RESPROPS.properties.city" name="Tax Id" :value="account.taxId" />
            <property :valueClass="RESPROPS.properties.city" name="Tax Office" :value="account.taxOffice" />
            <property :valueClass="RESPROPS.properties.title" name="Address 1" :value="account.address1" />
            <property :valueClass="RESPROPS.properties.title" name="2" :value="account.address2" />
            <property :valueClass="RESPROPS.properties.city" name="City" :value="account.city" />
            <property :valueClass="RESPROPS.properties.city" name="Country" :value="account.country" />
            <property :valueClass="RESPROPS.properties.createdAt" name="Created At" :value="account.createdAt" />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <member-list :list="memberList" @refreshed="refreshMemberList" />
    <history-list :list="historyList" @refreshed="refreshHistoryList" />
    <trans-list :list="transList"  @refreshed="refreshTransList" />

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
            properties: { name: 'col-10', contact: 'col-8', status: 'col-7', planName: 'col-7', users: 'col-7', title: 'col-10', city: 'col-7', createdAt: 'col-7' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', contact: 'col-5', status: 'col-3', planName: 'col-3', users: 'col-3', title: 'col-7', city: 'col-3', createdAt: 'col-3' },
          };
        }
      }
    },
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
    MemberList: () => import('./MemberList'),
    HistoryList: () => import('./HistoryList'),
    TransList: () => import('./TransList'),
    Property: () => import('@/component/app/Property.vue')
  }
};
</script>
