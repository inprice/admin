<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-clipboard-edit-outline</v-icon>
        <div>{{ prod.name }}</div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex justify-space-between" v-if="prod">
        <v-simple-table class="col d-table-cell property-table pt-3 pb-1" dense>
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="prop-name">Code</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="prod.code" /></td>
              </tr>
              <tr>
                <td class="prop-name">Name</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-10" v-model="prod.name" /></td>
              </tr>
              <tr>
                <td class="prop-name">Price</td>
                <td><v-text-field solo dense readonly hide-details="true" class="col-md-2 col-sm-3" :value="prod.price | toPrice" /></td>
              </tr>
              <tr>
                <td class="prop-name">Ranking</td>
                <td class="d-flex">
                  <v-text-field solo dense readonly hide-details="true" class="col-3" :value="prod.ranking || 'NA'" />
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="ml-1">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>
                      Indicates your rank among your competitors. <br>
                    </span>
                  </v-tooltip>
                </td>
              </tr>
              <tr>
                <td class="prop-name">Position</td>
                <td class="d-flex">
                  <v-text-field solo dense readonly hide-details="true" class="col-3" :value="prod.position | toPosition" />
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
              </tr>
              <tr>
                <td class="prop-name">Tags</td>
                <td>
                  <v-chip
                    class="mr-1"
                    outlined small
                    v-for="(tag, index) in prod.tags" :key="index"
                  >
                    {{ tag }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn 
                    small 
                    class="mb-2"
                    color="info"
                    @click="$emit('edit')">
                      Edit
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
  methods: {
    markPosition(pos) {
      if (pos == this.prod.position)
        return 'font-weight-bold text-uppercase yellow--text'
      else
        return '';
    },
  },
}
</script>
