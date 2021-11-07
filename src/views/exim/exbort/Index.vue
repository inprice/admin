<template>
  <div class="mt-2">
    <div class="title">Export your data</div>

    <div class="mt-2" :class="{ 'd-flex': $vuetify.breakpoint.mdAndUp }">
      <div :class="{ 'col pl-0': $vuetify.breakpoint.mdAndUp }">
        <product-export />
      </div>
      <div :class="{ 'col pr-0': $vuetify.breakpoint.mdAndUp, 'mt-5': $vuetify.breakpoint.smAndDown }">
        <link-export />
      </div>
    </div>

    <div :class="{ 'd-flex': $vuetify.breakpoint.mdAndUp, 'mt-5': $vuetify.breakpoint.smAndDown }">
      <div :class="{ 'col pl-0': $vuetify.breakpoint.mdAndUp }">
        <simple-definition-export entityName="brand" />
      </div>
      <div :class="{ 'col pr-0': $vuetify.breakpoint.mdAndUp, 'mt-5': $vuetify.breakpoint.smAndDown }">
        <simple-definition-export entityName="category" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ProductExport: () => import('./Product.vue'),
    LinkExport: () => import('./Link.vue'),
    SimpleDefinitionExport: () => import('./SimpleDefinitions.vue'),
  }
}
</script>
