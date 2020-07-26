<template>
  <div class="outer">
    <span class="inner">
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style scoped>
  .outer {
    width: 100%;
    height: 15px;
    color: gray;
    border-bottom: 1px solid lightgray;
    text-align: center;
    margin: 10px 0;
  }
  .inner {
    background: #e3edee;
    padding: 0 10px;
  }
</style>