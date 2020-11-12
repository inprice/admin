<template>
  <div>

    <div class="d-flex justify-space-between mt-2">
      <v-btn 
        small
        @click="$router.go(-1)">
          <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
          Go Back
      </v-btn>
      <v-btn 
        v-if="data && data.import"
        small
        @click="remove">
          <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
          Delete
      </v-btn>
    </div>

    <v-card class="mt-2">

      <v-card-title>
        <v-icon class="mr-4">mdi-format-list-bulleted</v-icon>
        <div>The import details of your upload.</div>
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1" dense v-if="data && data.import">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Type</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-2" v-model="data.import.type" /></td>
            </tr>
            <tr>
              <td class="prop-name">Date</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-3" v-model="data.import.createdAt" /></td>
            </tr>
            <tr>
              <td class="prop-name">Successes</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-2" :value="data.import.successCount" /></td>
            </tr>
            <tr>
              <td class="prop-name">Failes</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-2" :value="data.import.problemCount" /></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-divider></v-divider>

      <div v-if="data && data.list && data.list.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Data</th>
                <th>Problem</th>
                <th class="text-center">Eligible?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.list" :key="row.id">
                <td>{{ row.data }}</td>
                <td>{{ row.problem }}</td>
                <td class="text-center">{{ row.eligible ? 'YES' : 'NO' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>

      <div v-else class="ml-2 py-3">
        Wrong import identifier!
      </div>

    </v-card>
    <confirm ref="confirm" />

  </div>
</template>

<script>
import ImportService from '@/service/imbort';

export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'This import and its rows will be deleted. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          const result = await ImportService.remove(this.$route.params.id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Link successfully deleted.' });
            this.$router.push({ name: 'import' });
          }
        }
      });
    },
    findDetails() {
      ImportService.getDetailsList(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      });
    }
  },
  mounted() {
    this.findDetails();
  },
  components: {
    confirm: () => import('@/component/Confirm.vue')
  },
  watch: {
    '$route.path' () {
      if (window.location.href.indexOf('/import/details/') > 0) this.findDetails();
    }
  }
};
</script>

<style scoped>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>