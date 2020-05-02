<template>
  <div>
    <div v-if="rows && rows.length > 0">
      <v-row v-for="(row, index) in rows" :key="row.id" class="py-2">

        <v-hover v-slot:default="{ hover }">
          <v-card class="col pt-1 pb-1" :elevation="hover ? 8 : 2">

            <v-card-title class="py-1 pb-2 ">
              <div class="font-weight-regular">{{ row.name }}</div>
              <v-spacer></v-spacer>
              <div class="text-right caption">
                <v-switch
                  @change="toggle(row.id)"
                  v-model="row.active"
                  class="ma-0"
                  color="primary"
                  hide-details
                  :label="row.active == true ? 'Active' : 'Passive'"
                ></v-switch>
              </div>
            </v-card-title>

            <v-container fluid class="pt-0">
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
                            <td>Position</td> 
                            <td class="text-right">{{ row.position | toPosition }}</td>
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
                    <div class="headline text-center">{{ row.avgPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right">
                              {{ row.avgPrice | toDifferenceLine(row.price) }}
                            </td>
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
                    <div class="headline text-center">{{ row.minPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right">
                              {{ row.minPrice | toDifferenceLine(row.price) }}
                            </td>
                          </tr>
                          <tr>
                            <td>Platform</td> 
                            <td class="text-right">{{ row.minPlatform || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Seller</td> 
                            <td class="text-right">{{ row.minSeller || 'NA' }}</td>
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
                    <div class="headline text-center">{{ row.maxPrice | toCurrency }}</div>

                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Diff</td> 
                            <td class="text-right">
                              {{ row.maxPrice | toDifferenceLine(row.price) }}
                            </td>
                          </tr>
                          <tr>
                            <td>Platform</td> 
                            <td class="text-right">{{ row.maxPlatform || 'NA' }}</td>
                          </tr>
                          <tr>
                            <td>Seller</td> 
                            <td class="text-right">{{ row.maxSeller || 'NA' }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>

            <v-row>

              <div class="mt-1 ml-3">
                <span class="col-2 caption"><strong>Code</strong>: {{ row.code }}</span>
                <span class="caption"><strong>Date</strong>: {{ row.updatedAt || row.createdAt }}</span>
                <!--
                <semi-chip bgColor="#888" fgColor="#222" class="caption" tag="#" :value="row.code"></semi-chip>
                <semi-chip bgColor="#888" fgColor="#222" class="caption" tag="Updated" :value="row.updatedAt || row.createdAt"></semi-chip>
                -->
              </div>

              <v-spacer></v-spacer>

              <div class="my-1 mr-4">
                <v-btn class="mx-1" small @click="remove(row.id, row.name)">Delete</v-btn>
                <v-btn class="mx-1" width=80 small @click="edit(index)">Edit</v-btn>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-1" small v-on="on" :href="`product/links/${row.id}`" target="_blank">Manage Links</v-btn>
                  </template>
                  <span>Add & Remove links for this product to track prices</span>
                </v-tooltip>
              </div>
            </v-row>

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
    toggle(id) {
      this.$emit('toggle', id);
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
  // components: {
  //   SemiChip: () => import('@/component/SemiChip.vue')
  // }
};
</script>

<style scoped>
  .row > .col {
    padding: 3px;
  }
  .price-cell {
    padding: 0 2px;
    height: 140px;
  }
  .price-title {
    background-color: #eee;
    height: 32px;
    text-align: center;
    line-height: 32px;
  }
  .inline-chips {
    display: flex;
  }
  .inline-chips > .v-alert {
    margin: 10px 5px 10px;
  }
</style>