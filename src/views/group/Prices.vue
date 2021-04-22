<template>

  <div class="d-flex flex-wrap justify-space-around px-1" :style="{ 'min-width': findMinWidthForCells }" v-if="group.total">

    <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile>
      <div class="caption text-uppercase font-weight-light">
        Minimum Price
      </div>
      <div class="text-h6">
        <span v-if="$vuetify.breakpoint.smAndDown">
          {{ group.minPrice | toPrice }}
        </span>
        <span v-else>
          {{ group.minPrice | toCurrency }}
        </span>
      </div>
      <div class="caption">
        <span class="font-weight-medium">{{ group.minSeller }}</span> | {{ group.minPlatform }}
      </div>
    </v-card>

    <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile :style="{ 'min-width': findMinWidthForCells }">
      <div class="caption text-uppercase font-weight-light">
        Maximum Price
      </div>
      <div class="text-h6">
        <span v-if="$vuetify.breakpoint.smAndDown">
          {{ group.maxPrice | toPrice }}
        </span>
        <span v-else>
          {{ group.maxPrice | toCurrency }}
        </span>
      </div>
      <div class="caption">
        <span class="font-weight-medium">{{ group.maxSeller }}</span> | {{ group.maxPlatform }}
      </div>
    </v-card>

    <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile :style="{ 'min-width': findMinWidthForCells }">
      <div class="caption text-uppercase font-weight-light">
        Average Price
      </div>
      <div class="text-h6">
        <span v-if="$vuetify.breakpoint.smAndDown">
          {{ group.avgPrice | toPrice }}
        </span>
        <span v-else>
          {{ group.avgPrice | toCurrency }}
        </span>
      </div>
      <div>
        <span class="font-weight-medium">{{ group.actives }}</span> <span class="caption">active links</span>
      </div>
    </v-card>

    <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile v-if="!group.price" :style="{ 'min-width': findMinWidthForCells }">
      <div class="caption text-uppercase font-weight-light">
        Total
      </div>
      <div class="text-h6">
        <span v-if="$vuetify.breakpoint.smAndDown">
          {{ group.total | toPrice }}
        </span>
        <span v-else>
          {{ group.total | toCurrency }}
        </span>
      </div>
      <div>
        <span class="font-weight-medium">{{ group.linkCount }}</span> <span class="caption">total links</span>
      </div>
    </v-card>

    <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile v-if="group.price" :style="{ 'min-width': findMinWidthForCells }">
      <div class="caption text-uppercase font-weight-light">
        Your Price
      </div>
      <div class="text-h6">
        <span v-if="$vuetify.breakpoint.smAndDown">
          {{ group.price | toPrice }}
        </span>
        <span v-else>
          {{ group.price | toCurrency }}
        </span>
      </div>

      <level :level="group.level" />
    </v-card>

  </div>

</template>

<script>
export default {
  props: ['group'],
  methods: {
    findMinWidthForCells() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '48%'
        default:
          return '25%'
      }
    }
  },
  components: {
    Level: () => import('@/component/simple/Level.vue'),
  },
}
</script>
