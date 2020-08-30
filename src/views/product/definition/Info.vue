<template>
  <div>

    <div class="mt-4 title text-uppercase">
      {{ prod.name }}
    </div>

    <v-card>
      <v-simple-table class="property-table pt-3 pb-1" v-if="prod">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Code</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-5" v-model="prod.code" /></td>
            </tr>
            <tr>
              <td class="prop-name">Price</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-2" v-model="prod.price" /></td>
            </tr>
            <tr>
              <td class="prop-name">Brand</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-5" v-model="prod.brand" /></td>
            </tr>
            <tr>
              <td class="prop-name">Category</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-5" v-model="prod.category" /></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <div class="d-flex d-block justify-end pa-2" v-if="prod">
        <v-btn 
          small dark
          class="mx-10"
          color="red"
          @click="$emit('delete')">
            Delete
        </v-btn>
        <v-btn 
          small 
          color="info"
          @click="$emit('edit')">
            Edit
        </v-btn>
      </div>

      <p v-else>
        Invalid product info!
      </p>
    </v-card>

  </div>
</template>

<script>
export default {
  props: ['prod']
}
</script>
