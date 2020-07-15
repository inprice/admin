<template>
  <div>
    <span class="headline">Ooops!</span>

    <div v-if="$store.get('auth/IS_ADMIN')">
      <p>
        Seems that you have not choose a plan yet. Before proceed further you need buy a plan.
      </p>
      
      <span class="headline">Or</span>
      
      <p>
        You can subscribe a plan or apply a coupon code (if you have any)
        <v-btn :to="{name: 'subscription'}">Go Subscription Page</v-btn>
      </p>
    </div>
    <div v-else>
      <p>
        In order to define your products, you need to select a plan.
      </p>
    </div>
  </div>
</template>
