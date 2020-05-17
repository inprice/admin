<template>
  <div>
    <div class="display-1">
      Import Report
    </div>

    <p class="subtitle">
      You have just imported {{ report.rows.length }} products from a {{ report.type.replace('_', ' ') }} file. You can see the list below
    </p>

    <List :rows="report.rows" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      report: {}
    };
  },
  created() {
    this.report = this.$store.get('system/importProduct');
  },
  components: {
    List: () => import('./List.vue'),
  }
};
</script>
