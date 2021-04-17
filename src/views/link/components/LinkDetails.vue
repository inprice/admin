<template>
  <div>
    <v-btn-toggle tile :value="selectedTab">
      <v-btn v-for="(name, index) in tabs" @click="selectedTab=index" :key="index" small>{{ name }}</v-btn>
    </v-btn-toggle>

    <v-tabs v-model="selectedTab" class="v-card v-sheet theme--light">

      <!-- PRICES -->
      <v-tab-item>

        <v-timeline
          dense
          class="py-2"
          style="max-height: 200px; overflow-y: auto;"
          v-if="data && data.priceList && data.priceList.length"
        >
          <v-timeline-item
            small
            class="pb-0"
            v-for="row in data.priceList" :key="row.id"
            :icon="findDiffIcon(row.diffAmount)"
            :color="findDiffColor(row.diffAmount)"
          >
            <v-row class="pa-0 ma-0 py-1">
              <v-col class="py-1" cols="3">
                <div class="caption">
                  Price
                </div>
                <span class="subtitle-2">{{ row.price | toPrice }}</span>
              </v-col>
              <v-col class="py-1" cols="3">
                <div class="caption">
                  When
                </div>
                <span class="subtitle-2"><ago :date="row.createdAt" /></span>
              </v-col>
              <v-col class="py-1">
                <div 
                  v-if="row.diffAmount" 
                  class="subtitle-2 text-center d-flex justify-space-around"
                  style="max-width: 150px"
                >
                  <div>
                    <div class="caption">
                      Diff
                    </div>
                    <span>{{ row.diffAmount | toPrice }}</span>
                  </div>
                  <div>
                    <div class="caption">
                      Rate
                    </div>
                    <v-chip 
                      small 
                      label 
                      outlined
                      :color="findDiffColor(row.diffAmount)"
                      class="caption font-weight-medium ml-1"
                    >
                      {{ row.diffRate }}%
                    </v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>

      <!-- HISTORY -->
      <v-tab-item>

        <v-timeline
          dense
          class="py-2"
          style="max-height: 200px; overflow-y: auto;"
          v-if="data && data.historyList && data.historyList.length"
        >
          <v-timeline-item
            small
            class="pb-0"
            v-for="row in data.historyList" :key="row.id"
            :color="findStatusColor(row.statusGroup)"
          >
            <v-row class="pa-0 ma-0">
              <v-col class="py-1" cols="3">
                <div class="caption">
                  When
                </div>
                <span class="subtitle-2"><ago :date="row.createdAt" /></span>
              </v-col>
              <v-col class="py-1" cols="3">
                <div class="caption">
                  Status
                </div>
                <v-chip
                  small
                  label
                  outlined
                  :color="findStatusColor(row.statusGroup)"
                  class="subtitle-2"
                >
                  {{ row.statusGroup }}
                </v-chip>
              </v-col>
              <v-col class="py-1">
                <div class="caption">
                  Description
                </div>
                <span class="subtitle-2">{{ row.statusDescription }}</span>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>

        <block-message 
          v-else dense
          :message="'No data.'"
        />
      </v-tab-item>

      <!-- SPECS -->
      <v-tab-item>

        <table 
          class="subtitle-2 py-4" 
          v-if="data && data.specList && data.specList.length" 
          style="width: 100%; max-height: 200px; overflow-y: auto;"
        >
          <tbody>
            <tr v-for="row in data.specList" :key="row.id">
              <th class="text-right pr-3 py-1" width="25%">{{ row.key }} :</th>
              <td>{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>

    </v-tabs>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      tabs: ['Prices', 'History', 'Specs'],
      selectedTab: 0,
    }
  },
  methods: {
    findDiffIcon(diffAmount) {
      if (diffAmount < 0) return 'mdi-arrow-down';
      if (diffAmount == 0) return 'mdi-arrow-minus';
      return 'mdi-arrow-up';
    },
    findDiffColor(diffAmount) {
      if (diffAmount < 0) return 'green';
      if (diffAmount == 0) return 'blue';
      return 'red';
    },
    findStatusColor(status) {
      if (status == 'ACTIVE') return 'green';
      if (status == 'TRYING') return 'cyan';
      if (status == 'WAITING') return 'blue';
      return 'red';
    }
  },
  created() {
    if (this.data.brand && this.data.sku) {
      const brandProp = { key: 'Brand', value: this.data.brand };
      const skuProp = { key: 'Code', value: this.data.sku };

      if (this.data.specList.length == 0) {
        this.data.specList = [brandProp, skuProp];
      } else if (this.data.specList[0].value != skuProp.value && this.data.specList[0].value != brandProp.value) {
        this.data.specList.unshift(brandProp);
        this.data.specList.unshift(skuProp);
      }
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>

<style scoped>
  .v-timeline-item__body .row {
    border-bottom: 1px solid #ddd !important;
  }
  th, td {
    /* padding: 0 8px !important; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>