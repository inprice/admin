<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-2">
      <template v-slot:default>
        <tbody>
            <property name="Title" :value="info.title || 'Just created!'" />
            <property name="Address 1" :value="info.address1" />
            <property name="2" :value="info.address2" />
            <property name="Postcode" valueClass="col-2" :value="info.postcode" />
            <property name="City" valueClass="col-4" :value="info.city" />
            <property name="State" valueClass="col-4" :value="info.state" />
            <property name="Country" valueClass="col-6" :value="info.country" />

            <property valueClass="col-3">
              <td class="d-flex">
                <v-btn 
                  small 
                  color="success"
                  @click="openInvoiceInfoDialog">
                    Edit
                </v-btn>
              </td>
            </property>
        </tbody>
      </template>
    </v-simple-table>

    <InvoiceInfoDialog ref="invoiceInfoDialog" @saved="invoiceInfoUpdated" :countries="countries" />
  </div>
</template>

<script>
import SubsService from '@/service/subscription';
import countries from '@/data/countries';

export default {
  data() {
    return {
      countries,
      info: {},
    }
  },
  methods: {
    async openInvoiceInfoDialog() {
      this.$refs.invoiceInfoDialog.open();
    },
    invoiceInfoUpdated(data) {
      this.info = data;
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        if (country.value == this.info.country) {
          this.info.country = country.text;
          break;
        }
      }
    },
    fetchData() {
      SubsService.getInfo()
        .then((res) => {
          if (res && res.data) {
            this.invoiceInfoUpdated(res.data);
          }
        });
    }
  },
  components: {
    InvoiceInfoDialog: () => import('./InvoiceInfoEdit.vue'),
    Property: () => import('@/component/app/Property.vue')
  },
  created() {
    this.fetchData();
  }
}
</script>
