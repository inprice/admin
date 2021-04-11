<template>
  <div>
    <v-btn-toggle tile :value="selectedTab">
      <v-btn v-for="(name, index) in tabs" @click="selectedTab=index" :key="index" small>{{ name }}</v-btn>
    </v-btn-toggle>

    <v-tabs v-model="selectedTab" class="v-card v-sheet theme--light">

      <!-- PRICES -->
      <v-tab-item>
        <div 
          class="v-data-table v-data-table--dense theme--light put-behind" 
          v-if="data && data.priceList && data.priceList.length">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.priceTable.date">Date</th>
                  <th :width="RESPROPS.priceTable.price">Price</th>
                  <th :width="RESPROPS.priceTable.diff">Diff</th>
                  <th :width="RESPROPS.priceTable.position">Position</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.priceList" :key="row.id">
                  <td>
                    <ago :date="row.createdAt" />
                  </td>
                  <td>{{ row.price | toPrice }}</td>
                  <td>
                    <span>{{ row.diffAmount | toPrice }}</span>
                    <span v-if="row.diffAmount" class="d-inline-flex ml-1" style="background-color: #ff3">
                      [<diff-line smallicon class="mx-1" :diff="row.diffRate"></diff-line>]
                    </span>
                  </td>
                  <td>{{ row.position | toPosition }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>

      <!-- PROPERTIES -->
      <v-tab-item>
        <v-simple-table class="property-table pt-3 pb-2" dense v-if="data">
          <template v-slot:default>
            <tbody>
              <property :valueClass="RESPROPS.properties.brand" name="Brand" :value="data.brand" />
              <property :valueClass="RESPROPS.properties.shipment" name="Shipment" :value="data.shipment" />
              <property :valueClass="RESPROPS.properties.checkedAt" name="Checked">
                <ago v-if="data.checkedAt" :date="data.checkedAt" />
                <span v-else>NA</span>
              </property>
              <property :valueClass="RESPROPS.properties.updatedAt" name="Updated">
                <ago v-if="data.checkedAt" :date="data.updatedAt" />
                <span v-else>NA</span>
              </property>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

      <!-- HISTORY -->
      <v-tab-item>
        <div 
          class="v-data-table v-data-table--dense theme--light put-behind" 
          v-if="data && data.historyList && data.historyList.length">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.historyTable.date">Date</th>
                  <th :width="RESPROPS.historyTable.status">Status</th>
                  <th :width="RESPROPS.historyTable.problem">Problem</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.historyList" :key="row.id">
                  <td>
                    <ago :date="row.createdAt" />
                  </td>
                  <td>{{ row.status.replaceAll('_', ' ') }}</td>
                  <td>{{ row.statusDescription }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <block-message 
          v-else dense
          :message="'No data.'"
        />
      </v-tab-item>

      <!-- SPECS -->
      <v-tab-item>

        <table 
          class="featuresTable body-2 mt-2" 
          v-if="data && data.specList && data.specList.length" 
          style="width: 100%">
          <thead>
            <tr>
              <th width="35%">Feature</th>
              <th width="65%">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data.specList" :key="row.id">
              <td>{{ row.key }}</td>
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
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            'table-layout': 'fixed',
            priceTable: { date: '200px', price: '100px', diff: '150px', position: '150px' },
            historyTable: { date: '200px', status: '300px', problem: '400px' },
            properties: { brand: 'col-11', shipment: 'col-11', checkedAt: 'col-8', updatedAt: 'col-8' },
          };
        }
        default: {
          return {
            'table-layout': '',
            priceTable: { date: '25%', price: '15%', diff: '20%', position: '' },
            historyTable: { date: '25%', status: '25%', problem: '50%' },
            properties: { brand: 'col-7', shipment: 'col-7', checkedAt: 'col-4', updatedAt: 'col-4' },
          };
        }
      }
    },
  },
  data() {
    return {
      tabs: ['Prices', 'Properties', 'History', 'Specs'],
      selectedTab: 0,
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Property: () => import('@/component/app/Property.vue'),
    DiffLine: () => import('@/component/utility/DiffLine.vue'),
  }
}
</script>

<style scoped>
  .featuresTable tr {
    height: 30px; 
  }
  th, td {
    padding: 0 8px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>