<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-1 offset-2" v-if="session.planName">
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="prop-name">Name</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="session.planName" /></td>
          </tr>
          <tr>
            <td class="prop-name">Status</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="session.subsStatus" /></td>
          </tr>
          <tr>
            <td class="prop-name">Renewal Date</td>
            <td class="d-flex">
              <v-text-field solo dense readonly hide-details="true" class="col-4" v-model="session.subsRenewalAt" />
              <v-btn 
                small 
                class="offset-1"
                color="error"
                @click="cancel">
                  Cancel
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="d-flex pa-4" v-else>
      <div>You have <strong>no actual plan</strong> at the moment.</div>
      <v-spacer></v-spacer>
      <v-btn 
        small
        color="success"
        @click="router.push({ name: 'plans' })">
          Please pick a plan
      </v-btn>
    </div>

  </div>

</template>

<script>
export default {
  props: ['session'],
  methods: {
    cancel() {
      this.$emit('cancel');
    },
  }
};
</script>
