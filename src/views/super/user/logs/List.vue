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
          {{ row.createdAt }}
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

        <v-card class="my-2" v-if="row.reqBody">
          <div class="pa-2" style="background-color: aliceblue">
            <div class="d-flex justify-space-between ">
              <div><b>IP: </b>{{ row.ip }}</div>
              <div class="subtitle font-weight-medium">Request</div>
            </div>
            <div><b>Agent: </b>{{ row.agent }}</div>
          </div>
          <v-divider></v-divider>
          <vue-json-pretty 
            class="px-3 py-1"
            :showLine="false"
            :data="JSON.parse(row.reqBody)"
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
  },
};
</script>

<style scoped>
  .log-row div {
    padding: 5px 2px;
  }
</style>