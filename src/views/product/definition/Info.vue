<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-clipboard-edit-outline</v-icon>
        <div>{{ prod.name }}</div>
        <v-spacer></v-spacer>
        <v-btn 
          small dark
          color="red"
          @click="$emit('remove')">
            Delete
        </v-btn>
        <v-btn 
          small 
          class="mx-2"
          color="info"
          @click="$emit('edit')">
            Edit
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex justify-space-between" v-if="prod">
        <v-simple-table class="col d-table-cell property-table pt-3 pb-1" dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="prop-name">Code</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-md-5 col-sm-6" v-model="prod.code" /></td>
              </tr>
              <tr>
                <td class="prop-name">Price</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-md-2 col-sm-3" v-model="prod.price" /></td>
              </tr>
              <tr>
                <td class="prop-name">Brand</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-md-5 col-sm-6" v-model="prod.brand" /></td>
              </tr>
              <tr>
                <td class="prop-name">Category</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-md-5 col-sm-6" v-model="prod.category" /></td>
              </tr>
              <tr class="hidden-md-and-up">
                <td class="prop-name">Position</td>
                <td><single-position :position="prod.priceDetails.position" /></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <position class="hidden-sm-and-down ma-2" :position="prod.priceDetails.position" />
      </div>

      <p v-else>
        Invalid product info!
      </p>

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['prod'],
  components: {
    Position: () => import('@/component/utility/Position.vue'),
    SinglePosition: () => import('@/component/utility/SinglePosition.vue'),
  },
}
</script>
