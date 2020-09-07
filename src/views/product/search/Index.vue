<template>

  <div>
    <div class="display-1">
      Products
    </div>

    <p class="subtitle">
      In this section, you can manage your products whose prices you want to monitor.
    </p>
  
    <v-btn 
      small 
      class="mx-2"
      color="success"
      @click="addNew">
        Add new
    </v-btn>

    <edit ref="editDialog" @saved="1==1" />
    <confirm ref="confirm" />

  </div>

</template>

<script>
export default {
  methods: {
    addNew() {
      this.$refs.editDialog.open();
    }
  },
  components: {
    Edit: () => import('../definition/Edit'),
    confirm: () => import('@/component/Confirm.vue')
  },
}
</script>