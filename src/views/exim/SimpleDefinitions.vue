<template>
  <div class="mt-3">
    <div>
      <v-file-input
        dense
        counter
        outlined
        v-model="file"
        placeholder="Click here to load your file"
        prepend-icon=""
        accept="text/csv"
        :show-size="1000"
        @click:clear="clear"
        :disabled="loading"
      >
        <template v-slot:selection="{ index, text }">
          <v-chip
            dark
            label
            small
            v-if="index < 2"
          >
            {{ text }}
          </v-chip>
          <span
            v-else-if="index === 2"
            class="text-overline grey--text text--darken-3 mx-2"
          >
            +{{ file.length - 2 }} File
          </span>
        </template>
      </v-file-input>
    </div>

    <div v-show="result == null" class="mt-2">Specific rules</div>
    <div v-show="result == null" class="ml-4 my-2 body-2">
      - <span class="text-capitalize">{{ entityName }}</span> names cannot be shorter than 2 or longer than 50 chars
    </div>

    <div :class="{'mt-5' : !result }">Result</div>
    <v-card class="my-3" v-if="result">
      <table class="property-table">
        <tr v-if="result.total != null">
          <th width="10%">Total</th>
          <td>{{ result.total }}</td>
        </tr>
        <tr v-if="result.successCount != null">
          <th width="10%">Added</th>
          <td>{{ generateAddedStatement(result) }}</td>
        </tr>
        <tr>
          <th width="10%">Problems</th>
          <td>
            <div v-for="(problem, index) in result.problems" :key="index">{{ problem }}</div>
          </td>
        </tr>
      </table>
    </v-card>

    <block-message 
      class="my-3"
      v-if="!result"
      :loading="loading"
      :message="loading ? 'Loading, please wait...' : 'This area will be refreshed after your upload operation completed.'"
    />

    <div class="d-flex justify-end mt-5">
      <v-btn 
        small
        class="mr-1"
        @click="clear"
        :disabled="file == undefined || loading"
      >
        Reset
      </v-btn>
      <v-btn 
        small
        color="success"
        class="ml-1"
        @click="upload" 
        :disabled="file == undefined || loading || result != null"
      >
        Upload
      </v-btn>
    </div>
  </div>
</template>

<script>
import ApiService from '@/service/api';

export default {
  props: [ 'entityName' ],
  data() {
    return {
      loading: false,
      file: null,
      result: null,
    };
  },
  methods: {
    upload() {
      if (!this.file) return;
      this.loading = true;
      this.result = null;
      ApiService.uploadFile({
        file: this.file,
        url: `/exim/${this.entityName}/import`
      }).then(res => {
        console.log(res);
        if (res && res.data.status == 200) {
          this.result = res.data.data;
        } else {
          this.result = { 
            problems: [ `Failed to upload: ${res.data.reason}` ]
          };          
        }
      }).catch(err => {
        this.result = { 
          problems: [ `An error occurred: ${err.message}` ]
        };
      }).finally(() => this.loading = false);
    },
    clear() {
      this.loading = false;
      this.file = null;
      this.result = null;
    },
    generateAddedStatement(result) {
      if (result.successCount == 0) {
        return 'None of them is added!';
      } else if (result.successCount == result.total) {
        return 'All of them is added.';
      } else {
        return result.successCount + ` ${this.entityName}(s) added`;
      } 
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
 }
</script>
