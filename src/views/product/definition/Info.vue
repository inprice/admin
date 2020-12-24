<template>
  <div>

    <v-card class="pb-2">
      <div class="d-flex justify-space-between pa-4">
        <div class="my-auto"><v-icon class="mr-2">mdi-clipboard-edit-outline</v-icon> {{ prod.name }}</div>
        <v-btn 
          small 
          class="my-auto"
          color="success"
          @click="$emit('edit')">
            Edit
        </v-btn>
      </div>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1" dense v-if="prod">
        <template v-slot:default>
          <tbody>
            <property valueClass="col-4" name="Code" :value="prod.code" />
            <property valueClass="col-10" name="Name" :value="prod.name" />
            <property valueClass="col-3" name="Price" :value="prod.price | toCurrency" />
            <property valueClass="col-3" name="Ranking">
              <div class="d-flex">
                <v-card elevation="1" class="prop-value col-3">{{ prod.ranking || 'NA' }}</v-card>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="ml-1">mdi-help-circle-outline</v-icon>
                  </template>
                  <span>
                    Indicates your rank among your competitors. <br>
                  </span>
                </v-tooltip>
              </div>
            </property>

            <property valueClass="col-3" name="Position">
              <td class="d-flex">
                <v-card elevation="1" class="prop-value col-3">{{ prod.position | toPosition }}</v-card>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="ml-1">mdi-help-circle-outline</v-icon>
                  </template>
                  <span>
                    Indicates your position among your competitors.
                    <div class="ml-4" :class="markPosition(1)">Lowest</div>
                    <div class="ml-4" :class="markPosition(2)">Lower</div>
                    <div class="ml-4" :class="markPosition(3)">Average</div>
                    <div class="ml-4" :class="markPosition(4)">Higher</div>
                    <div class="ml-4" :class="markPosition(5)">Highest</div>
                  </span>
                </v-tooltip>
              </td>
            </property>

            <property valueClass="col-6" name="Tags" :value="prod.tags ? prod.tags.join(', ') : ''" />
          </tbody>
        </template>
      </v-simple-table>

      <p v-else>
        Invalid product info!
      </p>

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['prod'],
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
