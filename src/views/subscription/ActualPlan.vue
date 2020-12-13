<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-2 offset-2">
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="prop-name">Plan Name</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="session.planName || 'Not selected!'" /></td>
          </tr>
          <tr>
            <td class="prop-name">Status</td>
            <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="session.companyStatus" /></td>
          </tr>
          <tr>
            <td class="prop-name text-capitalize">{{ getCycleLabel }}</td>
            <td class="d-flex">
              <v-text-field solo dense readonly hide-details="true" class="col-4" :value="getEndDate" />
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="py-1">
              <v-btn 
                v-if="!hasCompanyActiveStatus(session.companyStatus, session.daysToRenewal)"
                small
                color="success"
                @click="$router.push({ name: 'plans' })">
                  Select a plan
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

  </div>

</template>

<script>
export default {
  props: ['session'],
  computed: {
    getCycleLabel() {
      if (this.hasCompanyActiveStatus(this.session.companyStatus, this.session.daysToRenewal)) {
        if (this.session.companyStatus == 'SUBSCRIBED')
          return 'Renewal';
        else
          return 'Ending';
      } else {
        if (this.session.companyStatus == 'NOT_SET')
          return 'Created At';
        else
          return this.session.companyStatus.toLowerCase() + ' At';
      }
    },
    getEndDate() {
      if (this.hasCompanyActiveStatus(this.session.companyStatus, this.session.daysToRenewal)) {
        return this.session.subsRenewalAt;
      } else {
        if (this.session.companyStatus == 'NOT_SET')
          return 'NOT_SET';
        else
          return this.session.lastStatusUpdate;
      }
    }
  },
};
</script>
