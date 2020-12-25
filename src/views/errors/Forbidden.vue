<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 15%)"
  >
    <v-row>
      <v-col>
        <v-icon large>mdi-emoticon-confused-outline</v-icon>
        <p class="title first-row">{{ title }}</p>
        <p class="number">{{ number }}</p>
        <p class="title second-row">
          {{ message }}
        </p>

        <v-btn :to="{ name: 'login' }" large class="mt-10">
          Turn to Dashboard
        </v-btn>
      </v-col>
    </v-row>
    <span class="mx-auto font-weight-bold "> <span class="blue--text">inprice</span> @ info@inprice.io</span>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      title: 'Permission problem!',
      number: 403,
      message: 'You are not allowed to enter this section!',
    };
  }
}
</script>

<style scoped>
  .number {
    color: #888;
    font-size: 120px;
    text-decoration: underline overline 8px;
  }
  .first-row, .second-row {
    color: #555;
  }
  i {
    font-size: 50px !important;
  }
</style>
