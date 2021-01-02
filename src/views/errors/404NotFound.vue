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

        <v-btn @click="$router.go(-1)" large class="mt-10">
          Go back
        </v-btn>
      </v-col>
    </v-row>
    <a class="mx-auto font-weight-bold" :href="'mailto:support@inprice.io?subject='+message">support@inprice.io</a>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      title: 'Page not found!',
      number: 404,
      message: 'The page you are looking for does not exist!',
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
    color: #444;
  }
  i {
    font-size: 50px !important;
  }
</style>
