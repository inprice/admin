<template>
  <div>

    <v-card outlined elevation="1">
      <div class="pa-4 d-flex">
        <v-icon class="mr-2 my-auto hidden-xs-only">mdi-clipboard-edit-outline</v-icon> 
        <div class="my-auto">
          <div>
            {{ group.name }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <div>
          <div class="caption text--secondary text-right">{{ group.position | toPosition }}</div>
          <div class="title">
            {{ group.price | toCurrency }}
          </div>
        </div>
      </div>
    </v-card>

  </div>
</template>

<script>
export default {
  props: ['group'],
  methods: {
    markPosition(pos) {
      if (pos == this.group.position)
        return 'font-weight-bold text-uppercase yellow--text'
      else
        return '';
    },
  },
}
</script>
