<template>
  <div>

    <div class="mt-6 caption text-uppercase">
      Statuses
    </div>
    <div class="mb-2 px-0 col-6">
      <v-select
        dense outlined
        hide-details
        v-model="status"
        :items="statuses"
        :menu-props="{ auto: true, overflowY: true }"
        @change="filter"
      />
    </div>

    <div v-if="rows && rows.length > 0" class="mt-10">

      <div class="caption text-uppercase">
        Imported rows
      </div>

      <v-simple-table dense class="ma-2 mb-1 bordered">
        <template v-slot:default>
          <thead>
            <tr>
              <th width="10%">Status</th>
              <th width="25%">Description</th>
              <th width="60%">Data</th>
              <th width="5%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filtered" :key="row.id">
              <td>{{ row.status }}</td>
              <td class="truncate">{{ row.description }}</td>
              <td class="truncate">{{ row.data }}</td>
              <td><v-btn class="ma-2" x-small elevation="0" fab @click="remove(row.id, index)"><v-icon dark>mdi-trash-can-outline</v-icon></v-btn></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

    </div>

    <p v-else class="mt-5">
      No row found! You can import new products from import menu.
    </p>

  </div>

</template>

<script>
import ImportService from '@/service/imbort';
import Utility from '@/helpers/utility';

export default {
  props: ['rows'],
  data() {
    return {
      status: null,
      filtered: [],
      statuses: [],
    }
  },
  methods: {
    async remove(id, index) {
      const result = await ImportService.remove(id);
      if (result == true) {
        this.rows.splice(index, 1);
        this.refreshList();
      }
    },
    refreshList() {
      if (this.rows && this.rows.length) {
        const map = {};
        this.rows.forEach((row) => {
          map[row.status] = (map[row.status] || 0) + 1;
        });

        let count = 0;
        this.statuses = [];
        Object.keys(map).forEach((key) => {
          const text = key.replace('_', ' ') + ` (${map[key]})`;
          this.statuses.push({ value: key, text });
          count += map[key];
        });
        this.status = null;
        this.statuses.unshift({ value: null, text: `ALL (${count})` });
      } else {
        this.status = null;
        this.filtered = [];
        this.statuses = [];
      }
    },
    filter() {
      if (this.status) {
        this.filtered = this.rows.filter(row => {
          return row.status == this.status;
        });
      } else {
        this.filtered = this.rows;
      }
    },
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.refreshList();
      this.filtered = this.rows;
    });
  }
};
</script>

<style scoped>

  th, td {
    padding: 0 4px;
  }

  .truncate {
    max-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>