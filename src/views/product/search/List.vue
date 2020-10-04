<template>
  <div>

    <p class="mt-3" v-if="!rows || rows.length < 1">
      No product found! You can add a new one or change your criteria.
    </p>

    <v-hover v-else v-for="row in rows" :key="row.id">
      <template v-slot="{ hover }">

        <v-card @click="edit(row.id)" class="mb-2 pb-3 transition-swing" :class="`elevation-${hover ? 6 : 2}`">
          <div class="d-flex justify-space-between text-uppercase pt-3 px-3 caption">
            <div>#{{ row.code }}</div>
            <div>{{ row.position | toPosition }}</div>
          </div>
          <div class="d-flex justify-space-between headline px-3 pt-1">
            <div class="">{{ row.name }}</div>
            <div>{{ row.price | toPrice }}</div>
          </div>

          <div class="d-flex justify-space-between">
            <div class="ml-2">
              <v-chip
                v-if="row.brand"
                class="ma-1 font-weight-bold"
                color="cyan darken"
                dark label small
              >
                {{ row.brand }}
              </v-chip>
              <v-chip
                v-if="row.category"
                class="ma-1 font-weight-bold"
                color="blue lighten"
                dark label small
              >
                {{ row.category }}
              </v-chip>
            </div>

            <div class="caption px-3 pt-1">
              <ago :date="row.updatedAt || row.createdAt" />
            </div>
          </div>

        </v-card>

      </template>
    </v-hover>
  </div>

</template>

<script>
export default {
  props: ['rows'],
  methods: {
    edit(id) {
      this.$emit('edit', id);
    },
  },
};
</script>

<style scoped>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>