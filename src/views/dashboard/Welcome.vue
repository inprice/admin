<template>
  <div class="body-2">

    <p class="text-h4 mt-3">Welcome to inprice</p>
    <p class="body-1">
      We are happy to see you on board, we hope you can get most out of the platform.
    </p>

    <div class="title mt-5">What to do</div>
    <p class="body-1">
      In order to begin competitive pricing, you need to do only {{ CURSTAT.status == 'CREATED' ? 'three' : 'two' }} things;
    </p>

    <div class="subtitle">
      <ol>
        <li v-show="CURSTAT.status == 'CREATED'">Subscribe to a suitable plan</li>
        <li>Define your products and then</li>
        <li>Add your competitors' product page links under those products</li>
      </ol>
    </div>

    <p class="subtitle mt-5">
      That's all, the rest will be taken care by the platform.
    </p>

    <p class="title mt-8">Do you need</p>

    <div class="d-flex ml-3">
      <div>
        <v-icon color="black" class="pr-3">mdi-lightbulb-on-outline</v-icon>
      </div>
      <div>
        <div class="body-1">Getting price suggestions for your products?</div>
        <v-divider class="my-2"></v-divider>
        <p>
          Define your Smart Pricing formulas! The price suggesiton mechanism basicly consists of mathematical functions based on certain factors namely your Product Price,
          Minimum, Average and Maximum Prices of your active competitors. Please refer to <router-link to="smart-prices" tabindex="-1">Smart Prices</router-link> section.
        </p>
      </div>
    </div>

    <div class="d-flex ml-3 mt-5">
      <div>
        <v-icon color="black" class="pr-3">mdi-lightbulb-on-outline</v-icon>
      </div>
      <div>
        <div class="body-1">To be notified when a product or competitor's indicator (ie position or price, min, avg, max) changed?</div>
        <v-divider class="my-2"></v-divider>
        <p>
          Set an alarm! You can set alarms being sensitive for position or price changes on your products or links. You will be notified via emails when the conditions are met.
        </p>
      </div>
    </div>

    <div class="d-flex ml-3 mt-5">
      <div>
        <v-icon color="black" class="pr-3">mdi-lightbulb-on-outline</v-icon>
      </div>
      <div>
        <div class="body-1">More than one workspace?</div>
        <v-divider class="my-2"></v-divider>
        <p>
          Create a new workspace! You are allowed to create and join multiple workspaces. Besides, you can invite new users into your workspace.
        </p>
      </div>
    </div>

    <div class="d-flex ml-3 mt-5">
      <div>
        <v-icon color="black" class="pr-3">mdi-lightbulb-on-outline</v-icon>
      </div>
      <div>
        <div class="body-1">A custom subscription plan?</div>
        <v-divider class="my-2"></v-divider>
        <p>
          Buy a voucher! Let us know what your needs are. So that we can arrange a tailor made plan for you. To do that you can either send an email explaining the details to us over <b><i>support@inprice.io</i></b> 
          or open a support ticket on Support section under User menu.
        </p>
      </div>
    </div>

    <div class="d-flex ml-3 mt-5">
      <div>
        <v-icon color="black" class="pr-3">mdi-lightbulb-on-outline</v-icon>
      </div>
      <div>
        <div class="body-1">A trial period to get used to the platform?</div>
        <v-divider class="my-2"></v-divider>
        <p>
          Use a 14-day free Basic Plan! During this period, you will be able to use the platform with all its features, no restrictions. Please remember that this offer is bound to your email address 
          not to workspace! Meaning that you can have this right only once.
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
}
</script>

<style>

</style>