<template>
  <v-card class="subtitle pb-5 px-1" :loading="loading" outlined>
    <v-card-title>
      <span class="text-capitalize">Links</span>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      You can specify for which links be downloaded by using the criteria below
    </v-card-text>

    <div class="px-4 pb-0">
      <v-form ref="form" @submit.prevent class="d-flex">
        <div class="col pa-0 pr-2">
          <v-select
            dense
            small-chips
            multiple
            outlined
            label="Statuses"
            v-model="form.grups"
            :items="grupItems"
            :menu-props="{ bottom: true, offsetY: true }"
          ></v-select>

          <v-text-field
            dense
            outlined
            label="Link Brand"
            v-model="form.brand"
            type="text"
            maxlength="50"
          />

          <v-text-field
            dense
            outlined
            label="Product Sku"
            v-model="form.sku"
            type="text"
            maxlength="50"
          />
        </div>

        <div class="col pa-0 pl-2">
          <v-select
            dense
            small-chips
            multiple
            outlined
            label="Positions"
            v-model="form.positions"
            :items="positionItems"
            item-text="text"
            item-value="value"
            :menu-props="{ bottom: true, offsetY: true }"
          ></v-select>

          <v-text-field
            dense
            outlined
            label="Seller"
            v-model="form.seller"
            type="text"
            maxlength="50"
          />

          <v-text-field
            dense
            outlined
            label="Platform"
            v-model="form.platform"
            type="text"
            maxlength="50"
          />
        </div>
      </v-form>

      <div class="d-flex justify-end">
        <v-btn 
          small
          color="primary"
          @click="download" 
          :disabled="loading"
        >
          Download
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import ApiService from '@/service/api';
import SystemData from '@/data/system';

export default {
  data() {
    return {
      form: {
        sku: null,
        brand: null,
        seller: null,
        platform: null,
        grups: [],
        positions: [],
      },
      grupItems: SystemData.LINK_STATUSES,
      positionItems: SystemData.POSITIONS,
      loading: false,
    }
  },
  methods: {
    download() {
      this.loading = true;
      ApiService.downloadFile(
        {
          form: this.form,
          url: '/exim/link/download', 
          fileName: 'links.csv'

        }
      ).finally(() => this.loading = false);
    }
  }
}
</script>
