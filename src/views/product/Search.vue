<template>
  <div>

    <v-row class="mb-3">
      <v-col cols="8">
        <v-text-field 
          ref="searchTerm"
          v-model="term"
          placeholder="Search for..."
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="clearTerm"
          dense
          rounded
          solo
          hide-details
        />
      </v-col>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ma-3" small fab dark color="success" @click="add" v-on="on">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </template>      
        <span>Add a new product</span>
      </v-tooltip>
    </v-row>

  </div>

</template>


<script>
export default {
  data() {
    return {
      term: ''
    }
  },
  watch: {
    term() {
      this.search();
    },
  },
  methods: {
    add() {
      this.$emit('add');
    },
    search() {
      this.$emit('search', this.term);
    },
    clearTerm() {
      this.term = '';
      this.$refs.searchTerm.focus();
    }
  }
};
</script>

<style scoped>
  .headline {
    margin-top: -10px;
  }
</style>
