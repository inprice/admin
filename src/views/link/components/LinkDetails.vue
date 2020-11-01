<template>
  <div>
    <v-btn-toggle tile :value="selectedTab">
      <v-btn v-for="(name, index) in tabs" @click="selectedTab=index" :key="index" small>{{ name }}</v-btn>
    </v-btn-toggle>

    <v-tabs v-model="selectedTab" class="v-card v-sheet theme--light mb-2">

      <!-- HISTORY -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="historyList && historyList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" width="20%">Date</th>
                <th class="text-center">Status</th>
                <th class="text-center">Problem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in historyList" :key="index">
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

      <!-- PRICES -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="priceList && priceList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" width="20%">Date</th>
                <th class="text-center">Price</th>
                <th class="text-center">Position</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in priceList" :key="row.id">
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

      <!-- SPECS -->
      <v-tab-item class="pb-2">
        <v-simple-table dense v-if="specList && specList.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Key</th>
                <th class="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in specList" :key="row.id">
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
  props: ["showInfoTab", "historyList", "priceList", "specList"],
  computed: {
    tabs() {
      let names = [ 'History' ];
      if (this.priceList && this.priceList.length) {
        names.push('Prices');
        if (this.specList && this.specList.length) {
          names.push('Specs');
        }
      }
      return names;
    }
  },
  data() {
    return {
      selectedTab: 0,
    }
  },
}
</script>

<style>

</style>