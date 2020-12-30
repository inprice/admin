<template>
  <div>

    <v-card class="pb-2">
      <div class="my-auto pa-4"><v-icon class="mr-2">mdi-clipboard-edit-outline</v-icon> {{ prod.name }}</div>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.code" name="Code" :value="prod.code" />
            <property :valueClass="RESPROPS.properties.price" name="Price" :value="prod.price | toCurrency" />
            <property :valueClass="RESPROPS.properties.position" name="Position" :value="prod.position | toPosition" />
            <property :valueClass="RESPROPS.properties.tags" name="Tags" :value="prod.tags.length ? prod.tags.join(', ') : 'NA'" />
          </tbody>
        </template>

      </v-simple-table>

      <v-divider class="my-2"></v-divider>
 
      <div class="py-2 d-flex">
        <v-btn 
          :disabled="$store.get('session/isViewer')"
          small 
          class="mx-auto"
          color="success"
          @click="$emit('edit')">
            Edit
        </v-btn>
      </div>

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['prod'],
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { code: 'col-8', price: 'col-5', position: 'col-5', tags: 'col-11 text-truncate' },
          };
        }
        case 'sm': {
          return {
            properties: { code: 'col-5', price: 'col-3', position: 'col-3', tags: 'col-10 text-truncate' },
          };
        }
        default: {
          return {
            properties: { code: 'col-3', price: 'col-2', position: 'col-2', tags: 'col-10 text-truncate' },
          };
        }
      }
    }
  },
  methods: {
    markPosition(pos) {
      if (pos == this.prod.position)
        return 'font-weight-bold text-uppercase yellow--text'
      else
        return '';
    },
  },
  components: {
    Property: () => import('@/component/app/Property.vue'),
  }
}
</script>
