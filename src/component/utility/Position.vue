<template>
  <v-card style="vertical-align: top;">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <div class="text-center caption grey lighten-2" v-on="on"><v-icon>mdi-help-circle-outline</v-icon> Position</div>
      </template>
      <span>Indicates your position among your competitors</span>
    </v-tooltip>

    <v-divider></v-divider>

    <div class="positions" >
      <template v-for="(pos) in positions">
        <div class="d-flex justify-space-between active" v-if="position == pos.value" :key="pos.value">
          <span class="arrow-right" />
          {{ pos.text }}
          <span class="arrow-left" />
        </div>
        <div class="text-center" v-else :key="pos.value">
          {{ pos.text }}
        </div>
      </template>
    </div>
  </v-card>
</template>

<script>
import SystemConsts from '@/data/system';

export default {
  name: "position",
  props: ['position'],
  computed: {
    positions() {
      return SystemConsts.POSITIONS;
    }
  }
}
</script>

<style>
  .positions div {
    text-align: center;
    min-width: 100px;
    margin: 4px;
    border-radius: 3px;
  }
  .positions .active {
    color: white;
    background-color: darkcyan;
    font-weight: 600;
    font-size: 95%;
    -webkit-box-shadow: 0px 4px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
  .positions :not(.active) {
    font-size: 85%;
    color: #666;
  }
  .arrow-right {
    margin: 1px;
    border-top: 12px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid white;
  }
  .arrow-left {
    margin: 1px;
    border-top: 12px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white;
  }
</style>