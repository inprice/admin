<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-circle-outline</v-icon>
            <div class="d-inline">
              <div>Profile</div>
              <div class="caption">Your profile info</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              text outlined
              color="warning"
              class="mx-2"
              @click="openChangePasswordDialog"
              :disabled="$store.get('session/isSuperUser')"
            >
              Change Password
            </v-btn>

            <v-btn
              small
              text outlined
              class="mx-2"
              @click="openUpdateUserDialog"
              :disabled="$store.get('session/isSuperUser')"
            >
              Edit User
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-2" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.name" name="Name" :value="CURSTAT.user" />
            <property :valueClass="RESPROPS.properties.timezone" name="Timezone" :value="CURSTAT.timezone" />
            <property :valueClass="RESPROPS.properties.role" name="Role" :value="CURSTAT.role" />
            <property :valueClass="RESPROPS.properties.password" name="Password" value="****" />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <UpdateUserDialog ref="updateUserDialog"/>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { name: 'col-10', timezone: 'col-8', role: 'col-6', password: 'col-6' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', timezone: 'col-6', role: 'col-4', password: 'col-4' },
          };
        }
      }
    },
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open(this.CURSTAT.email);
    },
    openUpdateUserDialog() {
      this.$refs.updateUserDialog.open({ name: this.CURSTAT.user, email: this.CURSTAT.email, timezone: this.CURSTAT.timezone });
    },
  },
  components: {
    UpdateUserDialog: () => import('./components/UpdateUser.vue'),
    ChangePasswordDialog: () => import('./components/ChangePassword.vue'),
    Property: () => import('@/component/app/Property.vue')
  }
}
</script>
