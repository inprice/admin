<template>
  <div class="mt-3">

    <div>File</div>
    <v-file-input
      dense
      counter
      outlined
      class="mt-2"
      v-model="file"
      placeholder="Click here to load your file"
      prepend-icon=""
      accept="text/csv"
      :show-size="1000"
      @click:clear="clear"
      :disabled="loading"
      :loading="loading"
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

    <div class="d-flex justify-end mt-4">
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
        Import
      </v-btn>
    </div>

    <div v-if="result != null" class="mt-2">
      <div>Result</div>
      <v-card class="mt-2">
        <table class="property-table">
          <tr v-if="result.total != null">
            <th width="10%">Total</th>
            <td>{{ result.total }}</td>
          </tr>
          <tr v-if="result.successCount != null">
            <th width="10%">Added</th>
            <td>{{ generateAddedStatement(result) }}</td>
          </tr>
          <tr v-if="result.problems && result.problems.length">
            <th width="10%">Problems ({{ result.problems.length }})</th>
            <td>
              <div v-for="(problem, index) in result.problems" :key="index">{{ problem }}</div>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <div v-if="result == null" class="mt-2">
      <div>Specific rules</div>
      <v-card class="mt-2" tile>
        <v-card-text>
          <ul>
            <li>Each row must have only one column: Name</li>
            <li><span class="text-capitalize">{{ entityName }}</span> names cannot be shorter than 2 or longer than 50 chars</li>
          </ul>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="result == null" class="d-flex mt-5">
      <div class="col pl-0">
        <div>Good example</div>
        <v-card class="mt-2" tile>
          <v-card-text style="font-family: Courier;">
            <div>APPLE</div>
            <div>SONY</div>
            <div>SAMSUNG</div>
          </v-card-text>
        </v-card>
      </div>
      <div class="col pr-0">
        <div>Bad example</div>
        <v-card class="mt-2" tile>
          <v-card-text style="font-family: Courier;">
            <div>A</div>
            <div>AB</div>
            <div>A NAME WITH MORE THAN 50 CHARS</div>
          </v-card-text>
        </v-card>
      </div>
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
        url: `/exim/${this.entityName}/upload`
      }).then(res => {
        if (res && res.data.status == 200) {
          this.result = res.data.data;
        } else {
          this.result = { 
            problems: [ `Failed to import: ${res.data.reason}` ]
          };          
        }
      }).catch(err => {
        this.result = { 
          problems: [ `Server error: ${err.message}` ]
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
        return 'Failed, none of them is added!';
      } else if (result.successCount == result.total) {
        return 'All of them is successfully added.';
      } else {
        return result.successCount + ` ${this.entityName}(s) added`;
      } 
    }
  },
 }
</script>
