<template>
  <v-card 
    tile 
    class="pa-2 pt-0"
  >
    <div class="d-flex subtitle-2">
      <div class="col-2">
        Date
      </div>
      <div class="col">
        Path
      </div>
      <div class="col-1">
        Method
      </div>
      <div class="col-1 text-right">
        Status
      </div>
      <div class="col-1 text-right">
        Elapsed
      </div>
    </div>

    <v-divider></v-divider>

    <div v-for="(row, index) in rows" :key="row.id" class="body-2" :style="selectedId==row.id ? 'border-left: 5px solid red' : ''">
      <div
        class="d-flex log-row px-2"
        style="cursor: pointer"
        :style="index % 2 == 0 ? 'background-color: #eee' : ''"
        @click="$emit('selected', row.id)"
      >
        <div class="col-2">
          {{ row.createdAt | formatPlainDate }}
        </div>
        <div class="col">
          {{ row.path }} {{ row.pathExt }}
        </div>
        <div class="col-1">
          {{ row.method }}
        </div>
        <div class="col-1 text-right">
          {{ row.status }}
        </div>
        <div class="col-1 text-right">
          {{ row.elapsed }}
        </div>
      </div>

      <v-divider v-if="selectedId==row.id"></v-divider>

      <div v-if="selectedId==row.id" class="ml-3 pa-2">

        <v-simple-table class="property-table pa-3" dense style="background-color: aliceblue; border: 1px solid #bbb">
          <template v-slot:default>
            <tbody>
              <tr>
                <td colspan="2" class="text-center font-weight-medium" style="background-color: #FBD395">REQUEST</td>
              </tr>
              <property :valueClass="RESPROPS.table.account" name="Account" :value="row.accountName" />
              <property :valueClass="RESPROPS.table.user" name="User" :value="row.userEmail" />
              <property :valueClass="RESPROPS.table.ip" name="IP" :value="row.ip" />
              <property :valueClass="RESPROPS.table.agent" name="U.Agent" :value="row.agent" :title="row.agent" />
            </tbody>
          </template>
        </v-simple-table>

        <v-card class="my-1" v-if="row.reqBody">
          <vue-json-pretty 
            v-if="row.reqBody"
            class="px-3 py-1"
            :showLine="false"
            :data="JSON.parse(row.reqBody)"
            style="background-color: aliceblue"
          > 
          </vue-json-pretty>
        </v-card>

        <v-card class="my-2" v-if="row.resBody">
          <div class="subtitle font-weight-medium pa-2" style="background-color: lightyellow">
            Response
          </div>
          <v-divider></v-divider>
          <div class="subtitle pa-3">
            {{ row.resBody }}
          </div>
        </v-card>

      </div>

    </div>
  </v-card>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  props: ['rows', 'selectedId'],
  components: {
    VueJsonPretty,
    Property: () => import('@/component/app/Property.vue')
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { account: 'col-10', user: 'col-8', ip: 'col-5', agent: 'col-12' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { account: 'col-7', user: 'col-5', ip: 'col-3', agent: 'col-12' },
          };
        }
      }
    },
  }
};
</script>

<style scoped>
  .log-row div {
    padding: 5px 2px;
  }
</style>