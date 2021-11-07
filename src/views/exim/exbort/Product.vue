<template>
  <v-card class="subtitle pb-5 px-1" :loading="loading" outlined>
    <v-card-title>
      <span class="text-capitalize">Products</span>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      You can specify for which products be downloaded by using the criteria below
    </v-card-text>

    <div class="px-4 pb-0">
      <v-form ref="form" @submit.prevent>
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

        <v-select
          dense
          outlined
          label="Brand"
          v-model="form.brandId"
          :items="brands"
          item-text="name"
          item-value="id"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-select
          dense
          outlined
          label="Category"
          v-model="form.categoryId"
          :items="categories"
          item-text="name"
          item-value="id"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
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
import BrandService from '@/service/brand';
import CategoryService from '@/service/category';

import SystemData from '@/data/system';

export default {
  data() {
    return {
      form: {
        positions: [],
        brandId: null,
        categoryId: null,
      },
      positionItems: SystemData.POSITIONS,
      brands: [],
      categories: [],
      loading: false,
    }
  },
  methods: {
    download() {
      this.loading = true;
      ApiService.downloadFile(
        {
          form: this.form,
          url: '/exim/product/download', 
          fileName: 'products.csv'

        }
      ).finally(() => this.loading = false);
    }
  },
  mounted() {
    BrandService.getList().then((res) => {
      if (res && res.data) {
        this.brands = res.data;
      }
    });
    CategoryService.getList().then((res) => {
      if (res && res.data) {
        this.categories = res.data;
      }
    });
  },
}
</script>
