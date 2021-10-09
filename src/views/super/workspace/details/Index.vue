<template>

  <div v-if="workspace" class="mt-3">

    <v-card>
      <div class="d-flex justify-space-between px-4 py-2 pt-4">
        <div class="d-flex">
          <v-icon class="mr-4 hidden-xs-only">mdi-card-workspace-details-star-outline</v-icon>
          <div class="d-inline">
            <div class="caption">{{ workspace.email }}</div>
            <div class="title">{{ workspace.name }}</div>
          </div>
        </div>

        <v-btn 
          small
          class="my-auto"
          @click="$router.go(-1)"
        >
          Go Back
        </v-btn>

      </div>

      <v-btn-toggle tile :value="selectedTab">
        <v-btn @click="selectedTab=0" small>
          Workspace
        </v-btn>

        <v-btn @click="selectedTab=1" small>
          Invoice
        </v-btn>
      </v-btn-toggle>

      <v-divider></v-divider>

      <v-tabs v-model="selectedTab">
        <v-tab-item>
          <v-simple-table class="property-table pt-3 pb-2" dense>
            <template v-slot:default>
              <tbody>
                <property :valueClass="RESPROPS.properties.name" name="Name" :value="workspace.name" />
                <property :valueClass="RESPROPS.properties.status" name="Status" :value="workspace.status" />
                <property :valueClass="RESPROPS.properties.planName" name="Plan" :value="workspace.plan ? workspace.plan.name : ''" />

                <property :valueClass="RESPROPS.properties.users" name="Numbers">
                  <div class="d-flex">
                    <div class="mr-1">
                      <span>User</span> : <span class="font-weight-medium red--text subtitle">{{ workspace.userCount }}</span>
                    </div>
                    <div class="mx-1">
                      <span>Link</span> : <span class="font-weight-medium green--text subtitle">{{ workspace.linkCount }}</span>
                    </div>
                    <div class="ml-1">
                      <span>Alarm</span> : <span class="font-weight-medium blue--text subtitle">{{ workspace.alarmCount }}</span>
                    </div>
                  </div>
                </property>

                <property :valueClass="RESPROPS.properties.createdAt" name="Created At" :value="workspace.createdAt" />
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>

        <v-tab-item>
          <v-simple-table class="property-table pt-3 pb-2" dense>
            <template v-slot:default>
              <tbody>
                <property :valueClass="RESPROPS.properties.title" name="Title" :value="workspace.title" />
                <property :valueClass="RESPROPS.properties.contact" name="Contact" :value="workspace.contactName" />
                <property :valueClass="RESPROPS.properties.city" name="Tax Id" :value="workspace.taxId" />
                <property :valueClass="RESPROPS.properties.city" name="Tax Office" :value="workspace.taxOffice" />
                <property :valueClass="RESPROPS.properties.title" name="Address 1" :value="workspace.address1" />
                <property :valueClass="RESPROPS.properties.title" name="2" :value="workspace.address2" />
                <property :valueClass="RESPROPS.properties.city" name="City" :value="workspace.city" />
                <property :valueClass="RESPROPS.properties.city" name="Country" :value="workspace.country" />
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
      </v-tabs>
    </v-card>

    <member-list :list="memberList" @refreshed="refreshMemberList" />
    <history-list :list="historyList" @refreshed="refreshHistoryList" />
    <trans-list :list="transList"  @refreshed="refreshTransList" />

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SU_WorkspaceService from '@/service/super/workspace';

export default {
  data() {
    return {
      workspace: null,
      memberList: [],
      historyList: [],
      transList: [],
      selectedTab: 0
    }
  },
  methods: {
    refreshMemberList() {
      if (this.workspace != null) {
        SU_WorkspaceService.fetchMemberList(this.workspace.id).then((res) => {
          if (res && res.status) {
            this.memberList = res.data;
          }
        });
      }
    },
    refreshHistoryList() {
      if (this.workspace != null) {
        SU_WorkspaceService.fetchHistoryList(this.workspace.id).then((res) => {
          if (res && res.status) {
            this.historyList = res.data;
          }
        });
      }
    },
    refreshTransList() {
      if (this.workspace != null) {
        SU_WorkspaceService.fetchTransactionList(this.workspace.id).then((res) => {
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
      SU_WorkspaceService.fetchDetails(aid).then((res) => {
        if (res && res.status) {
          this.workspace = res.data.workspace;
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
            properties: { name: 'col-10', contact: 'col-8', status: 'col-5', planName: 'col-7', users: 'col-7', title: 'col-10', city: 'col-7', createdAt: 'col-7' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', contact: 'col-5', status: 'col-3', planName: 'col-4', users: 'col-4', title: 'col-7', city: 'col-3', createdAt: 'col-3' },
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
