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
        :disabled="$store.get('session/isViewer')"
        v-if="data && data.import"
        small
        @click="remove">
          <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
          Delete
      </v-btn>
    </div>

    <v-card class="mt-2">

      <v-card-title class="pb-2">
        Details
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1" dense v-if="data && data.import">
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.type" name="Type" :value="data.import.type + (data.import.is_file ? ' File' : ' List')" />
            <property :valueClass="RESPROPS.properties.date" name="Date" :value="data.import.createdAt" />
            <property :valueClass="RESPROPS.properties.success" name="Success" :value="data.import.successCount || '0'" />
            <property :valueClass="RESPROPS.properties.fail" name="Fail" :value="data.import.problemCount || '0'" />
          </tbody>
        </template>
      </v-simple-table>

      <v-divider class="my-2"></v-divider>

      <div class="title ma-4 mb-2">Rows</div>

      <v-divider></v-divider>

      <div 
        class="v-data-table v-data-table--dense theme--light put-behind" 
        v-if="data && data.list && data.list.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.table.data">Data</th>
                <th :width="RESPROPS.table.looks">Looks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.list" :key="row.id">
                <td class="text-truncate">{{ row.data }}</td>
                <td>{{ row.problem || (data.import.type != 'CSV' ? 'Looks ' : '') + 'Fine' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="ma-2 pa-2">
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
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            'table-layout': 'fixed',
            properties: { type: 'col-8', date: 'col-8', success: 'col-3', fail: 'col-3' },
            table: { data: '800px', looks: '300px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            properties: { type: 'col-5', date: 'col-5', success: 'col-2', fail: 'col-2' },
            table: { data: '', looks: '15%' },
          };
        }
      }
    },
  },
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'This import and its rows will be deleted. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          const result = await ImportService.remove(this.$route.params.id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Import successfully deleted.' });
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
  created() {
    this.findDetails();
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
    Property: () => import('@/component/app/Property.vue')
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
  }
</style>