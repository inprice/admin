<template>
  <div>
    <v-btn-toggle tile :value="selectedTab">
      <v-btn v-for="(name, index) in tabs" @click="selectedTab=index" :key="index" small>{{ name }}</v-btn>
    </v-btn-toggle>

    <v-tabs v-model="selectedTab" class="v-card v-sheet theme--light">

      <!-- PRICES -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="data && data.priceList && data.priceList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" width="20%">Date</th>
                <th class="text-center">Price</th>
                <th class="text-center">Position</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.priceList" :key="row.id">
                <td class="text-center" width="20%">
                  <ago :date="row.createdAt" />
                </td>
                <td class="text-center">{{ row.price | toPrice }}</td>
                <td class="text-center">{{ row.position | toPosition }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else>
          <div class="pa-2 pb-0">No data!</div>
        </div>
      </v-tab-item>

      <!-- PROPERTIES -->
      <v-tab-item class="pb-2">
        <v-simple-table class="property-table pt-3 pb-1" dense v-if="data">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="prop-name">Brand</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-5" :value="data.brand || 'NA'" /></td>
              </tr>
              <tr>
                <td class="prop-name">Shipment</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-5" :value="data.shipment || 'NA'" /></td>
              </tr>
              <tr>
                <td class="prop-name">Last Check</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="data.lastCheck | formatDate" /></td>
              </tr>
              <tr>
                <td class="prop-name">Last Update</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="data.lastUpdate | formatDate" /></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

      <!-- HISTORY -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="data && data.historyList && data.historyList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" width="20%">Date</th>
                <th class="text-center">Status</th>
                <th class="text-center">Problem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in data.historyList" :key="index">
                <td class="text-center" width="20%">
                  <ago :date="row.createdAt" />
                </td>
                <td class="text-center">{{ row.status }}</td>
                <td class="text-center">{{ row.problem }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else>
          <div class="pa-2 pb-0">No data!</div>
        </div>
      </v-tab-item>

      <!-- SPECS -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="data && data.specList && data.specList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Key</th>
                <th class="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.specList" :key="row.id">
                <td class="text-center">{{ row.key }}</td>
                <td class="text-center">{{ row.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else>
          <div class="pa-2 pb-0">No data!</div>
        </div>
      </v-tab-item>

    </v-tabs>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      tabs: ['Prices', 'Properties', 'History', 'Specs'],
      selectedTab: 0,
    }
  },
}
</script>
