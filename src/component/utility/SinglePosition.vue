<template>
  <div class="positions" >
    <div class="d-flex justify-space-between active ml-0">
      <span class="arrow-right" />
      {{ positions[position] }}
      <span class="arrow-left" />
    </div>
  </div>
</template>

<script>
import SystemConsts from '@/data/system';

export default {
  name: "single-position",
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
    max-width: 100px;
    text-align: center;
    min-width: 100px;
    border-radius: 3px;
    padding-left: 0;
  }
  .positions .active {
    color: white;
    background-color: darkcyan;
    font-weight: 600;
    font-size: 95%;
    -webkit-box-shadow: 0px 4px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 4px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
  .arrow-right {
    margin-right: 5px;
    border-top: 12px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid white;
  }
  .arrow-left {
    margin-left: 5px;
    border-top: 12px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white;
  }
</style>