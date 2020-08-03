<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-text-box-check-outline</v-icon>
        <div>
          <div>Invoice Info</div>
          <div class="caption">The information below is used for billing operations</div>
        </div>

        <v-spacer></v-spacer>
        <v-btn 
          small 
          color="warning"
          @click="openInvoiceInfoDialog">
            Edit
        </v-btn>
       </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Title</td>
              <td><v-text-field solo dense readonly hide-details="true" :value="info.title || 'Not set!'" /></td>
            </tr>
            <tr>
              <td class="prop-name">Address Line 1</td>
              <td><v-text-field solo dense readonly hide-details="true" v-model="info.address1" /></td>
            </tr>
            <tr>
              <td class="prop-name">Line 2</td>
              <td><v-text-field solo dense readonly hide-details="true" v-model="info.address2" /></td>
            </tr>
            <tr>
              <td class="prop-name">Postcode</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-2" v-model="info.postcode" /></td>
            </tr>
            <tr>
              <td class="prop-name">City</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="info.city" /></td>
            </tr>
            <tr>
              <td class="prop-name">State</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="info.state" /></td>
            </tr>
            <tr>
              <td class="prop-name">Country</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-6" v-model="info.country" /></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

    </v-card>

    <InvoiceInfoDialog ref="invoiceInfoDialog" :saved="invoiceInfoUpdated" />
  </div>
</template>

<script>
import SubsService from '@/service/subscription';
import countries from '@/data/countries';

export default {
  data() {
    return {
      info: {},
    }
  },
  methods: {
    async openInvoiceInfoDialog() {
      await this.fetchData();
      this.$refs.invoiceInfoDialog.edit(this.info);
    },
    invoiceInfoUpdated(data) {
      this.info = data;
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        if (country.value == this.info.country) {
          this.info.country = country.value + ' - ' + country.text;
          break;
        }
      }
    },
    async fetchData() {
      const result = await SubsService.getInfo();
      if (result) this.invoiceInfoUpdated(result);
    }
  },
  components: {
    InvoiceInfoDialog: () => import('./InvoiceInfo.vue')
  },
  mounted() {
    this.fetchData();
  }
}
</script>
