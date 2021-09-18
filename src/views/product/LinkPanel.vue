<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <span class="font-weight-medium">{{ name }} ({{ links.length }})</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <links-table
        :links="links"
        @checked="$emit('checked')"
        @deleteOne="deleteOne"
        @moveOne="moveOne"
        @openAlarmDialog="openAlarmDialog"
      >
      </links-table>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ['name', 'links'],
  data() {
    return {
      selectAll: false,
      indeterminate: false
    }
  },
  methods: {
    openAlarmDialog(row) {
      this.$emit('openAlarmDialog', row);
    },
    deleteOne(row) {
      this.$emit('deleteOne', row);
    },
    moveOne(row) {
      this.$emit('moveOne', row);
    },
  },
  components: {
    LinksTable: () => import('../link/LinksTable.vue'),
  }
}
</script>
