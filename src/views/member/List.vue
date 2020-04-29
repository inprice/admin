  <template>
  <div>
    <div v-if="members && members.length > 0">

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Email</th>
              <th width="10%" class="text-center">Role</th>
              <th width="10%" class="text-center">Status</th>
              <th width="3%" class="text-center">Retry</th>
              <th width="20%" class="text-center hidden-sm-and-down">Date</th>
              <th width="5%" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mem in members" :key="mem.id">
              <td>{{ mem.email }}</td>
              <td class="text-center">{{ mem.role }}</td>
              <td class="text-center">{{ mem.status }}</td>
              <td class="text-center">{{ mem.retry }}</td>
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
                    <v-list-item @click="updateStatus(mem.id, 'PAUSED')" v-if="mem.status == 'PENDING' || mem.status == 'JOINED'">
                      <v-list-item-title>PAUSE</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="updateStatus(mem.id, mem.preStatus)" v-if="mem.status == 'PAUSED'">
                      <v-list-item-title>RESUME</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>
                    <v-list-item @click="changeRole(mem.id, mem.role, 'EDITOR')">
                      <v-list-item-title>
                        <v-icon left v-if="mem.role == 'EDITOR'">mdi-check</v-icon>
                        EDITOR
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeRole(mem.id, mem.role, 'VIEWER')">
                      <v-list-item-title>
                        <v-icon left v-if="mem.role == 'VIEWER'">mdi-check</v-icon>
                        VIEWER
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
    </div>

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
    updateStatus(id, newStatus) {
      this.$emit('updateStatus', { id, status: newStatus });
    },
    changeRole(id, currentRole, newRole) {
      if (currentRole != newRole) {
        this.$emit('changeRole', { id, role: newRole });
      }
    }
  }
};
</script>

<style>
  .v-data-table td {
    font-size: .9rem;
  }
</style>