<template>
  <div>

    <div class="display-1">
      Competitors' Statuses
    </div>

    <p class="subtitle">
      You can search all the statuses of your competitors here
    </p>

    <v-row class="mb-2 px-0">
      <v-col cols="8">
        <v-text-field 
          ref="searchTerm"
          v-model="searchForm.term"
          placeholder="Platform or Seller name"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="clearTerm"
          dense outlined
          hide-details
        />
      </v-col>

      <v-col cols="4">
        <v-select
          dense outlined
          hide-details
          v-model="searchForm.status"
          :items="statuses"
          :menu-props="{ auto: true, overflowY: true }"
        />
      </v-col>
    </v-row>

    <div v-if="rows && rows.length > 0" class="mt-6">

      <div class="caption text-uppercase">
        Competitors
      </div>

      <div v-for="row in rows" :key="row.id" class="mb-4">
        <v-hover v-slot:default="{ hover }">
          <v-card outlined :elevation="hover ? 2 : 0" class="pa-2">

            <v-btn icon @click="remove(row.id)" class="float-right mt-5 mr-2" :disabled="$store.get('auth/IS_JUST_VIEWER')">
              <v-icon>mdi-delete-forever-outline</v-icon>
            </v-btn>

            <table>
              <tr>
                <td class="subtitle-2">Name </td>
                <td class="body-2">{{ row.name || 'NA' }}</td>
              </tr>
              <tr>
                <td class="subtitle-2">Seller </td>
                <td class="body-2">{{ row.seller || 'NA' }}</td>
              </tr>
              <tr>
                <td class="subtitle-2">Platform </td>
                <td class="body-2">{{ row.platform  || 'NA' }}</td>
              </tr>
              <tr>
                <td class="subtitle-2">Price </td>
                <td class="body-2">{{ row.price | toCurrency }}</td>
              </tr>
              <tr>
                <td class="subtitle-2">Status </td>
                <td class="body-2">{{ row.status }}</td>
              </tr> 
              <tr>
                <td class="subtitle-2">Updated At </td>
                <td class="body-2">{{ (row.last_update || row.createdAt) | formatDate }}</td>
              </tr>
            </table>

          </v-card>
        </v-hover>
      </div>

      <v-btn  class="mt-2" @click="search(true)" :disabled="!isLoadMoreEnabled">Load More</v-btn>

    </div>

    <div v-else class="mt-5">
      No competitors found! You can change your criteria to find something else
    </div>

  </div>

</template>

<script>
import CompetitorService from '@/service/competitor';
import Utility from '@/helpers/utility';
import SystemConsts from '@/data/system';

export default {
  data() {
    return {
      rows: [],
      isLoadMoreEnabled: true,
      statuses: SystemConsts.STATUSES,
      searchForm: {
        term: '',
        status: null,
        lastRowNo: 0
      }
    }
  },
  watch: {
    'searchForm.term'() {
      this.search();
    },
    'searchForm.status'() {
      this.search();
    },
  },
  methods: {
    async remove(id) {
      const result = await CompetitorService.remove(id);
      if (result == true) this.search();
    },
    async search(loadmore=false) {
      this.isLoadMoreEnabled = false;

      if (!this.searchForm.status || this.searchForm.status == null) delete this.searchForm.status;

      if (loadmore == true) {
        this.searchForm.lastRowNo = this.rows.length;
      } else {
        this.searchForm.lastRowNo = 0;
      }

      const result = await CompetitorService.search(this.searchForm);

      if (result) {
        if (loadmore == true) {
          this.rows = this.rows.concat(result);
        } else {
          this.rows = result;
        }
        this.isLoadMoreEnabled = (result.length == SystemConsts.system.ROW_LIMIT_FOR_LISTS);
      } else {
        this.rows = [];
      }
    },
    clearTerm() {
      this.searchForm.term = '';
      this.$refs.searchTerm.focus();
    }
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.search();
    });
  }
};
</script>

<style scoped>
  .truncate {
    max-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .subtitle-2 {
    background-color: #eee;
    padding: 0 12px;
    min-width: 100px;
  }
</style>