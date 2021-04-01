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
              Last update <ago :date="group.updatedAt" class="d-inline font-weight-medium" />
            </span>
          </div>
          <div class="caption">The difference indicators under the prices are calculated according to your price</div>
        </div>

      <v-row class="mx-1 py-2">

        <!-- MINIMUM  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Minimum</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ group.minPrice | toPrice }}</div>
          <diff-line class="ml-1" :diff="group.diffMin"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption">{{ group.minPlatform || 'NA' }}</div>
          <div class="caption" :class="{ 'font-weight-bold': $vuetify.breakpoint.smAndUp }">{{ group.minSeller || 'NA' }}</div>

        </v-card>

        <!-- AVERAGE  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Average</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ group.avgPrice | toPrice }}</div>
          <diff-line class="ml-1" :diff="group.diffAvg"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption">Links</div>
          <div class="caption mx-auto font-weight-bold">
            <span class="teal--text">{{ group.position | toPosition }}</span>
            (<span class="red--text">
              {{ group.actives + '/' + group.passives }}
            </span>)
          </div>

        </v-card>

        <!-- MAXIMUM  -->
        <v-card class="col pa-0 ma-1 pb-2 text-center text-uppercase">
          <div class="caption py-2 teal--text">Maximum</div>

          <v-divider class="pb-2"></v-divider>

          <div class="text-h5 text-sm-h4">{{ group.maxPrice | toPrice }}</div>
          <diff-line :diff="group.diffMax"></diff-line>

          <v-divider class="my-2"></v-divider>

          <div class="caption">{{ group.maxPlatform || 'NA' }}</div>
          <div class="caption" :class="{ 'font-weight-bold': $vuetify.breakpoint.smAndUp }">{{ group.maxSeller || 'NA' }}</div>
        </v-card>

      </v-row>

    </v-card>

  </v-container>

</template>

<script>
export default {
  props: ['group'],
  components: {
    DiffLine: () => import('@/component/utility/DiffLine.vue'),
  },
}
</script>
