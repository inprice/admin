<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card v-if="row">
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>Access details</div>
        <v-btn icon @click="close" class="my-auto"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-card>
          <div class="subtitle font-weight-medium pa-2" style="background-color: lightyellow">
            REQUEST
          </div>
          <table class="list-table pa-3">
            <tbody>
              <tr>
                <th width="25%">Workspace</th>
                <td>{{ row.workspaceName }}</td>
              </tr>
              <tr>
                <th width="25%">User</th>
                <td>{{ row.userEmail }}</td>
              </tr>
              <tr>
                <th width="25%">IP</th>
                <td>{{ row.ip }}</td>
              </tr>
              <tr>
                <th width="25%">Agent</th>
                <td>{{ row.agent }}</td>
              </tr>
            </tbody>
          </table>

          <div style="max-height: 300px; overflow-y: auto">
            <vue-json-pretty 
              v-if="row.reqBody"
              :showLine="false"
              :data="JSON.parse(row.reqBody)"
              style="background-color: aliceblue;"
            > 
            </vue-json-pretty>
          </div>
        </v-card>

        <v-card class="my-2" v-if="row.resBody">
          <div class="subtitle font-weight-medium pa-2" style="background-color: lightyellow">
            RESPONSE
          </div>
          <v-divider></v-divider>
          <div class="subtitle pa-3" style="max-height: 100px; overflow-y: auto">
            {{ row.resBody }}
          </div>
        </v-card>
      </v-card-text>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  data() {
    return {
      row: null,
      show: false,
    };
  },
  methods: {
    open(row) {
      this.row = row;
      this.show = true;
    },
    close() {
      this.show = false;
      this.row = null;
    }
  },
  components: {
    VueJsonPretty,
  },
}
</script>
