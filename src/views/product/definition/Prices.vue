<template>

  <v-container fluid class="px-0">

    <v-card>
      
        <div class="px-4 pt-4">
          <div class="d-flex justify-space-between">
            <div class="title">
              <v-icon class="mr-4 hidden-xs-only">mdi-finance</v-icon>
              <span>Prices</span>
            </div>
            <span class="caption my-auto">
              Last update <ago :date="prod.updatedAt" class="d-inline font-weight-medium" />
            </span>
          </div>
          <div class="caption">The difference indicators under the prices are calculated according to your price</div>
        </div>

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

          <div class="caption">Your Rank</div>
          <div class="caption mx-auto font-weight-bold">
            <span class="teal--text">{{ prod.position | toPosition }}</span>
            (<span class="red--text">
              {{ prod.ranking && prod.linkCount ? prod.ranking + '/' + (prod.linkCount+1) : 'NA' }}
            </span>)
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
