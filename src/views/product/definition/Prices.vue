<template>

  <v-container fluid class="px-0">

    <v-card>
      
      <v-card-title class="pb-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-finance</v-icon>
        <div>
          <div>Prices</div>
          <div class="caption">The difference indicators under the prices are calculated according to your price</div>
        </div>
      </v-card-title>

      <v-row class="mx-1 py-2">

        <!-- MINIMUM  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Minimum</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ prod.minPrice | toPrice }}</div>
          <diff-line class="ml-1" :diff="prod.minDiff"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption">{{ prod.minPlatform || 'NA' }}</div>
          <div class="caption" :class="{ 'font-weight-bold': $vuetify.breakpoint.smAndUp }">{{ prod.minSeller || 'NA' }}</div>

        </v-card>

        <!-- AVERAGE  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Average</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ prod.avgPrice | toPrice }}</div>
          <diff-line class="ml-1" :diff="prod.avgDiff"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption teal--text">Your Rank</div>
          <div label outlined class="caption mx-auto" :class="{ 'font-weight-bold': $vuetify.breakpoint.smAndUp }">
            {{ (prod.ranking && prod.linkCount ? prod.ranking + '/' + (prod.linkCount+1) : '') }}
          </div>

        </v-card>

        <!-- MAXIMUM  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Maximum</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ prod.maxPrice | toPrice }}</div>
          <diff-line :diff="prod.maxDiff"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption">{{ prod.maxPlatform || 'NA' }}</div>
          <div class="caption" :class="{ 'font-weight-bold': $vuetify.breakpoint.smAndUp }">{{ prod.maxSeller || 'NA' }}</div>
        </v-card>

      </v-row>

      <div class="caption text-center pb-2 pl-3">
        Last update <ago :date="prod.updatedAt" class="d-inline font-weight-medium" />
      </div>

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
