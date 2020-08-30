<template>

  <v-container fluid class="px-0">

    <div class="mt-4 subtitle text-uppercase">Prices</div>

    <v-row dense>

      <v-col>
        <v-card>
          <div class="d-flex justify-space-between">
            <img :src="dialMin" :width="120" class="mx-2"/>
            <div class="ma-2">
              <div class="text-right">Minimum</div>
              <div class="display-1 text-right">{{ prod.minPrice | toPrice }}</div>
            </div>
          </div>

          <v-divider></v-divider>

          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Platform</td> 
                  <td class="text-right">{{ prod.minPlatform || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Seller</td> 
                  <td class="text-right">{{ prod.minSeller || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Diff</td> 
                  <td class="text-right px-2">
                    <diff-line :diff="prod.minDiff"></diff-line>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <div class="d-flex justify-space-between">
            <img :src="dialAvg" :width="120" class="mx-2"/>
            <div class="ma-2">
              <div class="text-right">Average</div>
              <div class="display-1 text-right">{{ prod.avgPrice | toPrice }}</div>
            </div>
          </div>

          <v-divider></v-divider>

          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Your Rank</td> 
                  <td class="text-right">{{ prod.ranking || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Competitors</td> 
                  <td class="text-right">{{ prod.competitors || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Diff</td> 
                  <td class="text-right px-2">
                    <diff-line :diff="prod.avgDiff"></diff-line>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <div class="d-flex justify-space-between">
            <img :src="dialMax" :width="120" class="mx-2"/>
            <div class="ma-2">
              <div class="text-right">Maximum</div>
              <div class="display-1 text-right">{{ prod.maxPrice | toPrice }}</div>
            </div>
          </div>

          <v-divider></v-divider>

          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Platform</td> 
                  <td class="text-right">{{ prod.maxPlatform || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Seller</td> 
                  <td class="text-right">{{ prod.maxSeller || 'NA' }}</td>
                </tr>
                <tr>
                  <td>Diff</td> 
                  <td class="text-right px-2">
                    <diff-line :diff="prod.maxDiff"></diff-line>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- v-row dense>

      <v-col>
        <v-card>
          <prices-line-chart 
            :height="150" :width="100"
            :labels="priceLabels"
            :minData="priceData.min"
            :avgData="priceData.avg"
            :maxData="priceData.max"
            v-if="priceData"
          />
        </v-card>
      </v-col>

    </v-row -->
  </v-container>

</template>

<script>
export default {
  props: ['prod', 'priceLabels', 'priceData'],
  data() {
    return {
      dialMin: require('@/assets/app/symbols/dial-min.svg'),
      dialAvg: require('@/assets/app/symbols/dial-avg.svg'),
      dialMax: require('@/assets/app/symbols/dial-max.svg'),
    }
  },
  components: {
    DiffLine: () => import('@/component/utility/DiffLine.vue'),
    //PricesLineChart: () => import('./PricesLineChart.js'),
  },
}
</script>
