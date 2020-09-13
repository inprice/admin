<template>
  <div>
    <v-simple-table v-if="rows && rows.length > 0">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Name</th>
            <th width="10%" class="text-right">Price</th>
            <th width="10%">Brand</th>
            <th width="10%">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" @click="edit(row.id)">
            <td class="col-6">{{ row.name }}</td>
            <td class="col-1 text-right">{{ row.price | toPrice }}</td>
            <td class="col-1">{{ row.brand }}</td>
            <td class="col-1">{{ row.category }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <p v-else class="mt-3">
      No product found! You can add a new one or change your criteria.
    </p>
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