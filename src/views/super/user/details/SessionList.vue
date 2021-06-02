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
              color="white"
              class="my-auto"
              @click="$emit('refreshed')"
              :disabled="$store.get('session/isNotSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="list.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.account">Account</th>
                  <th :width="RESPROPS.table.ip">IP</th>
                  <th class="text-center" :width="RESPROPS.table.os">OS</th>
                  <th class="text-center" :width="RESPROPS.table.browser">Browser</th>
                  <th class="text-center" :width="RESPROPS.table.date">Accessed</th>
                  <th class="text-center" :width="RESPROPS.table.action">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td>{{ row.accountName }}</td>
                  <td>{{ row.ip }}</td>
                  <td class="text-center">{{ row.os }}</td>
                  <td class="text-center">{{ row.browser }}</td>
                  <td class="text-center">{{ row.accessedAt }}</td>

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
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'User has no session.'"
      />

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['list'],
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { account: '250px', ip: '120px', os: '120px', browser: '150', date: '200px', action: '100px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { account: '', ip: '12%', os: '10%', browser: '12%', date: '20%', action: '12%' },
          };
        }
      }
    },
  },
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>
