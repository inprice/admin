<template>
  <div>
    <div v-if="rows && rows.length > 0">
      <v-row v-for="(row, index) in rows" :key="row.id" class="py-2">

        <v-hover v-slot:default="{ hover }">
          <v-card class="col pt-1 pb-1" :elevation="hover ? 8 : 2">

            <v-card-title class="py-1 ">
              <div class="font-weight-regular">{{ row.name }}</div>

              <v-spacer></v-spacer>

              <v-menu offset-y left>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>

                  <v-list-item @click="edit(index)" :disabled="$store.get('auth/IS_JUST_VIEWER')">
                    <v-list-item-title>EDIT</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="toggle(row.id, index)" :disabled="$store.get('auth/IS_JUST_VIEWER')">
                    <v-list-item-title>{{ row.active ? 'PAUSE' : 'RESUME' }}</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item @click="remove(row.id, row.name)" :disabled="$store.get('auth/IS_JUST_VIEWER')">
                    <v-list-item-title>DELETE</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link target="_blank" :href="`product/competitors/${row.id}`">
                    <v-list-item-title>COMPETITORS</v-list-item-title>
                  </v-list-item>

                </v-list>
              </v-menu>
            </v-card-title>

            <v-container fluid class="py-1">
              <v-row>
                <v-col>
                  <v-card class="price-cell" >
                    <div class="price-title">Yours</div>
                    <v-divider></v-divider>
                    <div class="headline text-center">{{ row.price | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Code</td> 
                            <td class="text-right">{{ row.code }}</td>
                          </tr>
                          <tr>
                            <td>Position</td> 
                            <td class="text-right">{{ row.priceDetails.position | toPosition }}</td>
                          </tr>
                          <tr>
                            <td>Updated</td> 
                            <td class="text-right">{{ (row.updatedAt || row.createdAt) | formatDate }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>

                <v-col>
                  <v-card class="price-cell" >
                    <div class="price-title">Min</div>
                    <v-divider></v-divider>
                    <div class="headline text-center">{{ row.priceDetails.minPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Platform</td> 
                            <td class="text-right">{{ row.priceDetails.minPlatform || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Seller</td> 
                            <td class="text-right">{{ row.priceDetails.minSeller || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right px-2">
                              <diff-line :diff="row.priceDetails.minDiff"></diff-line>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>

                <v-col>
                  <v-card class="price-cell" >
                    <div class="price-title">Avg</div>
                    <v-divider></v-divider>
                    <div class="headline text-center">{{ row.priceDetails.avgPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Your Rank</td> 
                            <td class="text-right">{{ row.priceDetails.ranking }}</td>
                          </tr>
                          <tr>
                            <td>Competitors</td> 
                            <td class="text-right">{{ row.priceDetails.competitors }}</td>
                          </tr>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right px-2">
                              <diff-line :diff="row.priceDetails.avgDiff"></diff-line>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>

                <v-col>
                  <v-card class="price-cell" >
                    <div class="price-title">Max</div>
                    <v-divider></v-divider>
                    <div class="headline text-center">{{ row.priceDetails.maxPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Platform</td> 
                            <td class="text-right">{{ row.priceDetails.maxPlatform || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Seller</td> 
                            <td class="text-right">{{ row.priceDetails.maxSeller || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right px-2">
                              <diff-line :diff="row.priceDetails.maxDiff"></diff-line>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>

          </v-card>
        </v-hover>
      </v-row>

      <v-row class="mt-3">
        <v-btn @click="loadmore" :disabled="!isLoadMoreEnabled">Load More</v-btn>
      </v-row>
    </div>
  
    <p v-else class="mt-3">
      No product found! You can add a new one or change your criteria.
    </p>
  </div>

</template>

<script>
export default {
  props: ['rows'],
  data() {
    return {
      isLoadMoreEnabled: true,
    }
  },
  methods: {
    edit(rowNo) {
      this.$emit('edit', rowNo);
    },
    toggle(id, index) {
      this.$emit('toggle', { id, index });
    },
    remove(id, name) {
      this.$emit('remove', { id, name});
    },
    loadmore() {
      this.$emit('loadmore');
    },
    setLoadMoreActivation(value) {
      this.isLoadMoreEnabled = value;
    }
  },
  components: {
    DiffLine: () => import('@/component/utility/DiffLine.vue')
  }
};
</script>

<style scoped>
  .row > .col {
    padding: 3px;
  }
  .price-cell {
    height: 140px;
  }
  .price-title {
    background-color: #eee;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .price-cell > .headline {
    border-bottom: 1px solid lightgray;
    padding-bottom: 1px;    
  }
  .inline-chips {
    display: flex;
  }
  .inline-chips > .v-alert {
    margin: 10px 5px 10px;
  }
</style>