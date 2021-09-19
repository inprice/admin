<template>

  <div>
    <div class="title">Brands</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <div class="col-6 pl-0">
        <v-text-field 
          :loading="loading"
          v-model="searchTerm"
          @keyup="isSearchable($event)"
          dense solo
          maxlength="100"
          hide-details
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
        >
        </v-text-field>
      </div>

      <v-btn 
        color="white"
        class="my-auto"
        @click="addNew"
        :disabled="$store.get('session/isNotEditor')"
      >
        Add
      </v-btn>
    </div>

    <v-card tile v-if="searchResult && searchResult.length">
      <table class="list-table">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th width="4%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in searchResult" :key="row.id">
            <td>{{ row.name }}</td>
            <td class="my-auto">
              <v-menu offset-y bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item link @click="update(row)" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>EDIT</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="remove(row)" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>DELETE</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <v-card v-else-if="!loading" >
      <block-message 
        :message="'No brand found! You can add a new one or change your criteria.'" 
      />
    </v-card>

    <edit ref="editDialog" @saved="saveNew" />
    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import BrandService from '@/service/brand';

export default {
  data() {
    return {
      searchTerm: '',
      loading: false,
      searchResult: [],
    };
  },
  methods: {
    addNew() {
      this.$refs.editDialog.open();
    },
    update(row) {
      let cloned = JSON.parse(JSON.stringify(row));
      this.$refs.editDialog.open(cloned);
    },
    async saveNew(form) {
      const result = await BrandService.save(form);
      if (result && result.status) this.search();
    },
    remove(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', row.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await BrandService.remove(row.id);
          if (result && result.status) this.search();
        }
      });
    },
    search() {
      this.loading = true;
      BrandService.search({ value: this.searchTerm })
        .then((res) => {
          if (res?.length) {
            this.searchResult = res;
          } else {
            this.searchResult = [];
          }
      }).finally(() => this.loading = false);
    },
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || (char > 45 && char < 91) || (char > 96 && char < 123)) {
        return this.search();
      }
    },
  },
  watch: {
    searchForm() {
      this.search();
    },
  },
  mounted() {
    this.search();
  },
  components: {
    Edit: () => import('./Edit.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
