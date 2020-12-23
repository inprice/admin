<template>

  <v-container fluid class="px-0">

    <v-card>
      
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-finance</v-icon>
        <div>
          <div>Prices</div>
          <div class="caption">The difference indicators under the prices are calculated according to your price</div>
        </div>
        <v-spacer></v-spacer>
        <div class="text-right caption">
          <strong>Updated</strong>
          <div>
            <ago :date="prod.updatedAt" />
          </div>
        </div>
      </v-card-title>

      <v-row class="mx-1 py-2">

        <!-- YOURS  -->
        <div class="col pa-0">

          <v-card class="mx-1 text-center text-uppercase">
            <div class="caption pt-1 teal--text">Your Price</div>
            <div class="font-weight-bold">{{ prod.price | toPrice }}</div>
          </v-card>

          <v-card class="mt-2 pb-2 mx-1 text-center text-uppercase">
            <div class="caption py-2 teal--text">Average Price</div>

            <v-divider></v-divider>

            <div class="display-1">{{ prod.avgPrice | toPrice }}</div>
            <diff-line :diff="prod.avgDiff"></diff-line>
          </v-card>

        </div>

        <!-- MINIMUM  -->
        <v-card class="col mx-1 pa-0 pb-2 text-center text-uppercase">
          <div class="caption py-3 teal--text">Minimum Price</div>

          <v-divider></v-divider>

          <div class="caption pt-2">{{ prod.minPlatform || 'NA' }}</div>
          <div class="caption font-weight-bold">{{ prod.minSeller || 'NA' }}</div>

          <div class="display-1">{{ prod.minPrice | toPrice }}</div>
          <diff-line :diff="prod.minDiff"></diff-line>
        </v-card>

        <!-- MAXIMUM  -->
        <v-card class="col mx-1 pa-0 pb-2 text-center text-uppercase">
          <div class="caption py-3 teal--text">Maximum Price</div>

          <v-divider></v-divider>

          <div class="caption pt-2">{{ prod.maxPlatform || 'NA' }}</div>
          <div class="caption font-weight-bold">{{ prod.maxSeller || 'NA' }}</div>

          <div class="display-1">{{ prod.maxPrice | toPrice }}</div>
          <diff-line :diff="prod.maxDiff"></diff-line>
        </v-card>

      </v-row>
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
