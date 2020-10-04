<template>
  <div :title="date" class="clickable" v-if="date">
    {{ date | formatDate }}
  </div>
</template>

<script>
export default {
  props: ['date']
}
</script>

<style scoped>
  .clickable {
    cursor: pointer !important;
  }
</style>