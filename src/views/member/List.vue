  <template>
  <div>
    <v-card elevation="3" v-if="members && members.length > 0">

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Email</th>
              <th width="10%" class="text-center">Role</th>
              <th width="10%" class="text-center">Status</th>
              <th width="3%" class="text-center d-none d-sm-table-cell">Retry</th>
              <th width="20%" class="text-center hidden-sm-and-down">Date</th>
              <th width="5%" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mem in members" :key="mem.id">
              <td>{{ mem.email }}</td>
              <td class="text-center">{{ mem.role }}</td>
              <td class="text-center">{{ mem.status }}</td>
              <td class="text-center d-none d-sm-table-cell">{{ mem.retry }}/3</td>
              <td class="text-center hidden-sm-and-down">{{ mem.updatedAt || mem.createdAt }}</td>
              <td class="text-right" v-if="mem.status != 'LEFT'">
                <v-menu offset-y left>
                  <template v-slot:activator="{ on }">
                    <v-btn x-small fab elevation="1"  v-on="on">
                      <v-icon dark>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="resend(mem.id)" v-if="mem.status == 'PENDING' && mem.retry < 3">
                      <v-list-item-title>INVITE AGAIN</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="pause(mem.id)" v-if="mem.status == 'PENDING' || mem.status == 'JOINED'">
                      <v-list-item-title>PAUSE</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="resume(mem.id)" v-if="mem.status == 'PAUSED'">
                      <v-list-item-title>RESUME</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>
                    <v-list-item @click="changeRole(mem.id, mem.role, 'EDITOR')">
                      <v-list-item-title>
                        EDITOR
                        <v-icon right v-if="mem.role == 'EDITOR'">mdi-check</v-icon>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeRole(mem.id, mem.role, 'VIEWER')">
                      <v-list-item-title>
                        VIEWER
                        <v-icon right v-if="mem.role == 'VIEWER'">mdi-check</v-icon>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

              </td>
              <td class="text-center" v-else>LEFT</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <p v-else class="mt-3">
      No member found!
    </p>
  </div>

</template>

<script>
export default {
  props: ['members'],
  methods: {
    resend(id) {
      this.$emit('resend', id);
    },
    pause(id) {
      this.$emit('pause', id);
    },
    resume(id) {
      this.$emit('resume', id);
    },
    changeRole(id, currentRole, newRole) {
      if (currentRole != newRole) {
        this.$emit('changeRole', { id, role: newRole });
      }
    }
  }
};
</script>

<style scopped>
  .v-data-table td {
    font-size: .9rem;
  }
  .v-data-table__wrapper thead tr {
    background: #DDDD;
  }
  .v-icon.v-icon::after {
    height: 0;
  }
</style>