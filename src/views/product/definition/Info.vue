<template>
  <div>

    <v-card outlined elevation="1">
      <div class="pa-4 d-flex">
        <v-icon class="mr-2 my-auto hidden-xs-only">mdi-clipboard-edit-outline</v-icon> 
        <div class="my-auto">
          <div class="caption text--secondary">#{{ prod.code }}</div>
          <div>
            {{ prod.name }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <div>
          <div class="caption text--secondary text-right">{{ prod.position | toPosition }}</div>
          <div class="title">
            {{ prod.price | toCurrency }}
          </div>
        </div>
      </div>
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
