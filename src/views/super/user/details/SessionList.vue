<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-book-open</v-icon>
            <div class="d-inline">
              <div>Sessions</div>
              <div class="caption">All the opened sessions by the user</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              class="mx-1"
              @click="terminateAllSessions"
              :disabled="$store.get('session/isNotSuperUser') || !list || !list.length"
            >
              Terminate All
            </v-btn>
            <v-btn
              small
              class="mx-1"
              @click="$emit('refreshed')"
              :disabled="$store.get('session/isNotSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="list.length" style="max-height: 350px; overflow: auto">
        <table class="list-table">
          <thead>
            <tr>
              <th>Workspace</th>
              <th width="12%" class="hidden-sm-and-down">IP</th>
              <th>Agent</th>
              <th width="15%">Accessed</th>
              <th width="5%">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>{{ row.workspaceName }}</td>
              <td class="hidden-sm-and-down">{{ row.ip }}</td>
              <td>{{ row.userAgent }}</td>
              <td>{{ row.accessedAt | formatPlainDate }}</td>

              <td style="padding: 0px !important; text-align: center !important;">
                <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                  <template v-slot:activator="{ on }">
                    <v-btn small icon v-on="on">
                      <v-icon dark>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="$emit('terminated', row.hash)">
                      <v-list-item-title>
                        TERMINATE
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <block-message 
        v-else dense
        :message="'No session found.'"
      />
    </v-card>

    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
export default {
  props: ['list', 'email'],
  methods: {
    terminateAllSessions() {
      this.$refs.confirm.open('Terminate All Sessions', `all the sessions of ${this.email}. Are you sure?`, 'You are about to terminate').then(async (confirm) => {
        if (confirm == true) this.$emit('allTerminated');
      });
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  },
}
</script>
