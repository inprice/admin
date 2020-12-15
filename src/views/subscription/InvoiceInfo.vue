<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-2">
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="prop-name">Title</td>
            <td><v-text-field solo dense readonly hide-details="true" :value="info.title || 'Just created!'" /></td>
          </tr>
          <tr>
            <td class="prop-name">Address 1</td>
            <td><v-text-field solo dense readonly hide-details="true" v-model="info.address1" /></td>
          </tr>
          <tr>
            <td class="prop-name">2</td>
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
            <td class="d-flex">
              <v-text-field solo dense readonly hide-details="true" class="col-6" v-model="info.country" />
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="py-1">
              <v-btn 
                small 
                color="success"
                @click="openInvoiceInfoDialog">
                  Edit
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

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
      SubsService.getInfo()
        .then((res) => {
          if (res && res.data) {
            this.invoiceInfoUpdated(res.data.data);
          }
        });
    }
  },
  components: {
    InvoiceInfoDialog: () => import('./InvoiceInfoEdit.vue')
  },
  mounted() {
    this.fetchData();
  }
}
</script>
