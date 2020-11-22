<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(70vh);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="h2 red--text mb-4">
          <v-icon large color="red">mdi-close-circle</v-icon> Payment Cancelled!
        </h1>

        <h3 class="mb-8">We are sorry to see you cancelling subscription the platform.</h3>
        
        <div>Please don't forget that you can subscribe the platform whenever you want.</div>
        <div>If you have any problem, please contact us with an email <strong>support@inprice.io</strong></div>

        <v-btn
          class="mt-10"
          :to="{ name: 'plans' }"
          color="primary"
          outlined
        >
          Turn to dashboard
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
