<template>

  <v-container fluid class="px-0">

    <v-card>
      
      <v-card-title class="pb-1">
        <v-icon class="mr-4">mdi-finance</v-icon>
        <div>
          <div>Prices</div>
          <div class="caption">Calculated prices of your competitors defined in the following section</div>
        </div>
        <v-spacer></v-spacer>
        <div class="text-right caption">
          <div>Updated</div>
          <div class="font-weight-bold">{{ prod.priceDetails.createdAt | formatDate }}</div>
        </div>
      </v-card-title>

      <v-row class="mx-1 py-2">

        <!-- YOURS  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-1" color="cyan" elevation="4">
            <div class="text-center text-uppercase white--text">
              <div class="caption pt-2 font-weight-bold">Yours</div>
              <div class="title font-weight-bold">{{ prod.priceDetails.price | toPrice }}</div>
            </div>
          </v-sheet>

          <!-- AVERAGE  -->
          <v-sheet
            class="mt-2 pb-2"
            color="cyan"
            elevation="10"
          >
            <div class="text-center text-uppercase white--text">
              <div class="caption pt-2 font-weight-bold">Average</div>
              <span class="display-1 font-weight-bold">{{ prod.priceDetails.avgPrice | toPrice }}</span>
            </div>
            <div class="text-center text-uppercase white--text font-weight-bold">
              <diff-line :diff="prod.priceDetails.avgDiff"></diff-line>
            </div>
          </v-sheet>
        </v-card>

        <!-- MINIMUM  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-1" color="green" elevation="4">
            <div class="text-center white--text font-weight-bold">
              <div class="caption pt-2 font-weight-bold">{{ prod.priceDetails.minPlatform || 'NA' }}</div>
              <div class="title">{{ prod.priceDetails.minSeller || 'NA' }}</div>
            </div>
          </v-sheet>

          <v-sheet
            class="mt-2 pb-2"
            color="green"
            elevation="10"
          >
            <div class="text-center text-uppercase white--text">
              <div class="pt-2 caption font-weight-bold">Minimum</div>
              <div class="display-1 font-weight-bold">{{ prod.priceDetails.minPrice | toPrice }}</div>
            </div>
            <div class="text-center text-uppercase white--text font-weight-bold">
              <diff-line :diff="prod.priceDetails.minDiff"></diff-line>
            </div>
          </v-sheet>
        </v-card>

        <!-- MAXIMUM  -->
        <v-card class="col pt-3 mx-1">
          <v-sheet class="pb-1" color="deep-orange darken-1" elevation="4">
            <div class="text-center white--text">
              <div class="caption pt-2 font-weight-bold">{{ prod.priceDetails.maxPlatform || 'NA' }}</div>
              <div class="title">{{ prod.priceDetails.maxSeller || 'NA' }}</div>
            </div>
          </v-sheet>

          <v-sheet
            class="mt-2 pb-2"
            color="deep-orange darken-1"
            elevation="10"
          >
            <div class="text-center text-uppercase white--text">
              <div class="pt-2 caption font-weight-bold">Maximum</div>
              <div class="display-1 font-weight-bold">{{ prod.priceDetails.maxPrice | toPrice }}</div>
            </div>
            <div class="text-center text-uppercase white--text font-weight-bold">
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
  props: ['prod', 'priceLabels', 'priceData'],
  components: {
    DiffLine: () => import('@/component/utility/DiffLine.vue'),
  },
}
</script>
