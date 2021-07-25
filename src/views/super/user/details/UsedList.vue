<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-alpha-s-circle-outline</v-icon>
            <div class="d-inline">
              <div>Used services</div>
              <div class="caption">Onetime used services.</div>
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
                  <th :width="RESPROPS.table.service">Service</th>
                  <th class="text-center" :width="RESPROPS.table.date">Date</th>
                  <th class="text-center" :width="RESPROPS.table.whitelisted">Unlimited</th>
                  <th class="text-center" :width="RESPROPS.table.action">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td>{{ row.type }}</td>
                  <td class="text-center">{{ row.createdAt }}</td>
                  <td class="text-center">{{ row.whitelisted ? 'YES' : 'NO' }}</td>

                  <td style="padding: 0px !important; text-align: center !important;">
                    <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                      <template v-slot:activator="{ on }">
                        <v-btn small icon v-on="on">
                          <v-icon dark>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list dense>
                        <v-list-item @click="remove(row.id, row.type)">
                          <v-list-item-title>
                            DELETE THIS USE
                          </v-list-item-title>
                        </v-list-item>

                        <v-divider></v-divider>

                        <v-list-item link @click="toggleUnlimitedServiceUse(row)">
                          <v-list-item-title>{{ row.whitelisted ? 'REMOVE' : 'ALLOW' }} UNLIMITED USE</v-list-item-title>
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
        :message="'No used service found.'"
      />

    </v-card>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    toggleUnlimitedServiceUse(row) {
      this.$refs.confirm.open('Service Use', `You are about to ${row.whitelisted ? 'remove the' : 'give a'} permission to user for use of ${row.type} indefinetely. Are you sure?`).then(async (confirm) => {
        if (confirm == true) this.$emit('toggledUnlimitedUse', row.id);
      });
    },
    remove(id, type) {
      this.$refs.confirm.open('Service Use', 'You are about to remove ' + type + '. By doing that, user can use the same service one more time. Are you sure?').then(async (confirm) => {
        if (confirm == true) this.$emit('deleted', id);
      });
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { service: '250px', date: '200px', whitelisted: '100px', action: '100px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { service: '', date: '20%', whitelisted: '12%', action: '12%' },
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
