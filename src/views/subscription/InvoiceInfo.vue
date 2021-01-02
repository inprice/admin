<template>
  <div>
    <v-simple-table class="property-table pt-3 pb-2" dense>
      <template v-slot:default>
        <tbody>
          <property :valueClass="RESPROPS.properties.title" name="Title" :value="info.title" />
          <property :valueClass="RESPROPS.properties.title" name="Address1" :value="info.address1" />
          <property :valueClass="RESPROPS.properties.title" name="2" :value="info.address2" />
          <property :valueClass="RESPROPS.properties.postcode" name="Postcode" :value="info.postcode" />
          <property :valueClass="RESPROPS.properties.city" name="City" :value="info.city" />
          <property :valueClass="RESPROPS.properties.state" name="State" :value="info.state" />
          <property :valueClass="RESPROPS.properties.country" name="Country" :value="info.country" />
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center pb-3">
      <v-btn 
        small 
        color="success"
        @click="openInvoiceInfoDialog">
          Edit
      </v-btn>
    </div>

    <InvoiceInfoDialog ref="invoiceInfoDialog" @saved="invoiceInfoUpdated" :countries="countries" />
  </div>
</template>

<script>
import SubsService from '@/service/subscription';
import countries from '@/data/countries';

export default {
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { title: 'col-11', postcode: 'col-6', city: 'col-9', state: 'col-9', country: 'col-11' },
          };
        }
        case 'sm': {
          return {
            properties: { title: 'col-11', postcode: 'col-3', city: 'col-5', state: 'col-5', country: 'col-7' },
          };
        }
        default: {
          return {
            properties: { title: 'col-10', postcode: 'col-2', city: 'col-3', state: 'col-3', country: 'col-5' },
          };
        }
      }
    },
  },
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
