<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-alpha-s-circle-outline</v-icon>
            <div class="d-inline">
              <div>Services usage</div>
              <div class="caption">Onetime used services.</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
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
        <table class="list-table">
          <thead>
            <tr>
              <th width="25%">Service</th>
              <th width="15%" class="text-center">Date</th>
              <th>String</th>
              <th width="8%" class="text-center hidden-sm-and-down">Boolean</th>
              <th width="8%" class="text-center">Integer</th>
              <th width="15%" class="text-center">Time</th>
              <th width="5%" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>{{ row.mark }}</td>
              <td class="text-center">{{ row.createdAt | formatPlainDate }}</td>
              <td :title="row.stringVal">{{ row.stringVal }}</td>
              <td class="text-center">{{ row.booleanVal ? 'YES' : 'NO' }}</td>
              <td class="text-center">{{ row.integerVal }}</td>
              <td class="text-center">{{ row.dateVal }}</td>

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

                    <v-list-item link v-if="row.mark == 'FREE_USE'" @click="toggleUnlimitedServiceUse(row)">
                      <v-list-item-title>{{ row.booleanVal ? 'REMOVE' : 'ALLOW' }} UNLIMITED USE</v-list-item-title>
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
        :message="'No service found.'"
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
}
</script>
