<template>

  <div>
    <div class="title">Smart Price Formulas</div>

    <div class="body-2 my-3">
      <p>
        The purporse of <i>Smart Pricing</i> is to suggest you a calculated <i>Price</i> based on some certain factors including product price and base price as well as minimum, 
        average and maximum price of your active competitors. Whenever a change happened on one of the factors, smart pricing mechanism immediately steps in and calculates 
        a new price according to your formulas. So, this calculated price helps you in your price estimation effort.
      </p>
      <p>
        You can use any of the factors mentioned above to build your formulas.
        In addition to this, there are several built-in functions to form more complex formulas. We put some useful examples at the bottom of edit page to assist you.
      </p>
      <p>
        In order to put your smart prices in use, you need to bind them to related products. So that you will see suggested prices when your products have active competitors.
      </p>
    </div>

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
        small
        class="my-auto"
        @click="$router.push( { name: 'smart-price', params: { id: 'new' } })"
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
            <th class="text-left">Formula</th>
            <th class="text-left">Lower Limit</th>
            <th class="text-left">Upper Limit</th>
            <th width="4%"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in searchResult" :key="row.id"
            @click="$router.push( { name: 'smart-price', params: { id: row.id } })"
            style="cursor: pointer"
          >
            <td>{{ row.name }}</td>
            <td>{{ row.formula }}</td>
            <td>{{ row.lowerLimitFormula }}</td>
            <td>{{ row.upperLimitFormula }}</td>
            <td class="my-auto">
              <v-menu offset-y bottom left :disabled="$store.get('session/isNotEditor')">
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
                  <v-list-item link @click="$router.push( { name: 'smart-price', params: { id: row.id } })">
                    <v-list-item-title>EDIT</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="remove(row)">
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
        :message="'No smart price found! You can add a new one or change your criteria.'" 
      />
    </v-card>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import SmartPriceService from '@/service/smartprice';

export default {
  data() {
    return {
      searchTerm: '',
      loading: false,
      searchResult: [],
    };
  },
  methods: {
    remove(row) {
      this.$refs.confirm.open('Delete', 'will be deleted and also removed from the linked products. Are you sure?', row.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await SmartPriceService.remove(row.id);
          if (result && result.status) this.search();
        }
      });
    },
    search() {
      this.loading = true;
      SmartPriceService.search({ value: this.searchTerm })
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
      if (char == 8 || char > 31) {
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
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
