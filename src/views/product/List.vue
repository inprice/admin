<template>
  <div>
    <div v-if="rows && rows.length > 0">
      <v-row v-for="(row, index) in rows" :key="row.id" class="py-2">

        <v-hover v-slot:default="{ hover }">
          <v-card class="col pt-1 pb-1" :elevation="hover ? 8 : 2">

            <v-card-title class="py-1 pb-0 ">
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

            <v-row>
              <div class="col pa-1">
                <div class="text-center">Your</div>
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
              </div>

              <div class="col pa-1">
                <div class="text-center">Avg</div>
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
              </div>

              <div class="col pa-1">
                <div class="text-center">Min</div>
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
                        <td class="text-right">{{ row.minPlatform }}</td>
                      </tr>
                      <tr>
                        <td>Seller</td> 
                        <td class="text-right">{{ row.minSeller }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>

              <div class="col pa-1">
                <div class="text-center">Max</div>
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
                        <td class="text-right">{{ row.maxPlatform }}</td>
                      </tr>
                      <tr>
                        <td>Seller</td> 
                        <td class="text-right">{{ row.maxSeller }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-row>

            <v-divider></v-divider>

            <v-row class="mt-1 ml-1">

              <div class="inline-chips">
                <semi-chip bgColor="#555" class="caption" tag="Updated" :value="row.updatedAt"></semi-chip>
                <semi-chip bgColor="#555" class="caption" tag="#" :value="row.code"></semi-chip>
              </div>

              <v-spacer></v-spacer>

              <div class="mt-2 mr-2">
                <v-btn class="mx-1" small color="red" dark @click="remove(row.id, row.name)">Delete</v-btn>
                <v-btn class="mx-1" width=80 small color="success" @click="edit(index)">Edit</v-btn>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-1" small color="primary" v-on="on">Manage Links</v-btn>
                  </template>
                  <span>Add & Remove links for this product to track prices</span>
                </v-tooltip>
              </div>
            </v-row>

          </v-card>
        </v-hover>
      </v-row>

      <v-row class="mt-3">
        <v-btn>Load More</v-btn>
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
  methods: {
    edit(rowNo) {
      this.$emit('edit', rowNo);
    },
    toggle(id) {
      this.$emit('toggle', id);
    },
    remove(id, name) {
      this.$emit('remove', { id, name});
    }
  },
  components: {
    SemiChip: () => import('@/component/SemiChip.vue')
  }
};
</script>

<style scoped>
  .inline-chips {
    display: flex;
  }
  .inline-chips > .v-alert {
    margin: 10px 5px 10px;
  }
</style>