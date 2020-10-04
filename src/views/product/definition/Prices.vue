<template>

  <v-container fluid class="px-0">

    <v-card>
      
      <v-card-title class="pb-1">
        <v-icon class="mr-4">mdi-finance</v-icon>
        <div>
          <div>Prices</div>
          <div class="caption">Calculated prices of your links defined in the following section</div>
        </div>
        <v-spacer></v-spacer>
        <div class="text-right caption">
          <strong>Updated</strong>
          <div>
            <ago :date="prod.priceDetails.createdAt" />
          </div>
        </div>
      </v-card-title>

      <v-row class="mx-1 py-2">

        <!-- YOURS  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-1" color="#fbffdd" elevation="2">
            <div class="text-center text-uppercase">
              <div class="caption pt-2">Your Price</div>
              <div class="title">{{ prod.priceDetails.price | toPrice }}</div>
            </div>
          </v-sheet>

          <!-- AVERAGE  -->
          <v-sheet
            class="mt-2 pb-2"
            color="#fbffdd"
            elevation="2"
          >
            <div class="text-center text-uppercase">
              <div class="caption pt-2">Average Price</div>
              <span class="display-1">{{ prod.priceDetails.avgPrice | toPrice }}</span>
            </div>
            <div class="text-center text-uppercase">
              <diff-line :diff="prod.priceDetails.avgDiff"></diff-line>
            </div>
          </v-sheet>
        </v-card>

        <!-- MINIMUM  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-3" color="#d0ffef" elevation="2">
            <div class="text-center caption pt-2 text-uppercase">
              <div>Min. Seller & Platform</div>
              <div class="pt-1">
                <span class="font-weight-bold orange--text">{{ prod.priceDetails.minSeller || 'NA' }}</span> / {{ prod.priceDetails.minPlatform || 'NA' }}
              </div>
            </div>
          </v-sheet>

          <v-sheet
            class="mt-2 pb-2"
            color="#d0ffef"
            elevation="2"
          >
            <div class="text-center text-uppercase">
              <div class="pt-2 caption">Minimum Price</div>
              <div class="display-1">{{ prod.priceDetails.minPrice | toPrice }}</div>
            </div>
            <div class="text-center text-uppercase">
              <diff-line :diff="prod.priceDetails.minDiff"></diff-line>
            </div>
          </v-sheet>
        </v-card>

        <!-- MAXIMUM  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-3" color="#e0ebfd" elevation="2">
            <div class="text-center caption pt-2 text-uppercase">
              <div>Max. Seller & Platform</div>
              <div class="pt-1">
                <span class="font-weight-bold orange--text">{{ prod.priceDetails.maxSeller || 'NA' }}</span> / {{ prod.priceDetails.maxPlatform || 'NA' }}
              </div>
            </div>
          </v-sheet>

          <v-sheet
            class="mt-2 pb-2"
            color="#e0ebfd"
            elevation="2"
          >
            <div class="text-center text-uppercase">
              <div class="pt-2 caption">Maximum Price</div>
              <div class="display-1">{{ prod.priceDetails.maxPrice | toPrice }}</div>
            </div>
            <div class="text-center text-uppercase">
              <diff-line :diff="prod.priceDetails.maxDiff"></diff-line>
            </div>
          </v-sheet>
        </v-card>

      </v-row>
      <div class="pa-2 pl-4 caption"><strong>Please note that</strong> the difference indicators under the prices are calculated according to your price.</div>          
    </v-card>

  </v-container>

</template>

<script>
export default {
  props: ['prod'],
  components: {
    DiffLine: () => import('@/component/utility/DiffLine.vue'),
  },
}
</script>
