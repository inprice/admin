<template>
  <div>

    <v-btn-toggle tile :value="selectedTab">
      <v-btn v-for="(name, index) in tabs" @click="selectedTab=index" :key="index" small>{{ name }}</v-btn>
    </v-btn-toggle>

    <v-tabs v-model="selectedTab" class="v-card v-sheet theme--light">

      <!-- PRICES -->
      <v-tab-item>

        <v-timeline
          dense
          class="py-2"
          style="max-height: 200px; overflow-y: auto;"
          v-if="data && data.priceList && data.priceList.length"
        >
          <v-timeline-item
            small
            class="pb-0"
            v-for="(row, index) in data.priceList" :key="row.id"
            :icon="findDiffIcon(row.diffAmount)"
            :color="findDiffColor(row.diffAmount)"
          >
            <v-row class="pa-0 ma-0 py-1" :class="index == data.priceList.length-1 ? 'last-row' : ''">
              <v-col class="py-1" cols="3">
                <div class="caption">
                  When
                </div>
                <ago class="subtitle-2" :date="row.createdAt" />
              </v-col>
              <v-col class="py-1" cols="3">
                <div class="caption">
                  Price
                </div>
                <span class="subtitle-2">{{ row.price | toPrice }}</span>
              </v-col>
              <v-col class="py-1">
                <div 
                  class="subtitle-2 text-center d-flex justify-space-around"
                  style="max-width: 150px"
                >
                  <div>
                    <div class="caption">
                      Diff
                    </div>
                    <span>{{ row.diffAmount | toPrice }}</span>
                  </div>
                  <div>
                    <div class="caption">
                      Rate
                    </div>
                    <v-chip 
                      small 
                      label 
                      outlined
                      :color="findDiffColor(row.diffAmount)"
                      class="caption font-weight-medium ml-1"
                    >
                      {{ row.diffRate }}%
                    </v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>

      <!-- HISTORY -->
      <v-tab-item>

        <v-timeline
          dense
          class="py-2"
          style="max-height: 200px; overflow-y: auto;"
          v-if="data && data.historyList && data.historyList.length"
        >
          <v-timeline-item
            small
            class="pb-0"
            v-for="(row, index) in data.historyList" :key="row.id"
            :color="findStatusColor(row.statusGroup)"
          >
            <v-row class="pa-0 ma-0 py-1" :class="index == data.historyList.length-1 ? 'last-row' : ''">
              <v-col class="py-1" cols="3">
                <div class="caption">
                  When
                </div>
                <ago class="subtitle-2" :date="row.createdAt" />
              </v-col>
              <v-col class="py-1 hidden-xs-only" cols="3">
                <v-chip
                  small
                  label
                  outlined
                  :color="findStatusColor(row.statusGroup)"
                  class="subtitle-2"
                  style="min-width: 100px; text-align: center; display: inline-block; margin: 10px auto;"
                >
                  {{ row.statusGroup }}
                </v-chip>
              </v-col>
              <v-col class="py-1">
                <div class="caption">
                  Description
                </div>
                <span class="subtitle-2">{{ row.statusDescription }}</span>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>

        <block-message 
          v-else dense
          :message="'No data.'"
        />
      </v-tab-item>

      <!-- SPECS -->
      <v-tab-item>

        <table 
          class="py-4" 
          v-if="data && data.specList && data.specList.length" 
          style="width: 100%; max-height: 200px; overflow-y: auto;"
        >
          <tbody>
            <tr v-for="row in data.specList" :key="row.id">
              <th class="subtitle-2 text-right pr-2" width="20%">{{ row.key }} :</th>
              <td class="body-2 text-truncate">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>

    </v-tabs>

    <v-divider class="my-2"></v-divider>

    <alarm-note
      :hasIcon="false"
      :alarm="alarm"
      @clicked="$emit('openAlarmDialog')"
    >
    </alarm-note>
  </div>
</template>

<script>
export default {
  props: ['data', 'alarm'],
  data() {
    return {
      tabs: ['Prices', 'History', 'Specs'],
      selectedTab: 0,
    }
  },
  components: {
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>

<style scoped>
  .v-timeline-item__body .row:not(.last-row) {
    border-bottom: 1px solid #ddd !important;
  }
  th, td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
