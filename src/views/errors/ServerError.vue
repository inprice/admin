<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <p class="display-1 primary--text">Whoops, Something went wrong!</p>

        <p class="display-2">{{problem}}</p>

        <v-btn
          :to="{ name: 'login' }"
          color="primary"
          outlined
        >
          Sign In
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      problem: this.$route.query.problem
    }
  }
}
</script>