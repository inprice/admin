<template>
  <div class="d-flex justify-center mt-5">
    <div style="max-width: 400px">
      <div class="text-h5 mb-6 text-center">Product Reports</div>

      <v-form ref="form" @submit.prevent>
        <v-select
          dense
          outlined
          hide-details
          label="Please select a report"
          v-model="selectedReport"
          :items="reportItems"
          item-text="text"
          item-value="value"
          return-object
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-divider class="my-6"></v-divider>

        <v-select
          dense
          outlined
          label="Group By"
          v-model="form.group"
          :items="groupItems"
          item-text="text"
          item-value="value"
          v-show="selectedReport.value == 'Product_Groups'"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

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

        <v-select
          dense
          outlined
          label="Alarm ?"
          v-model="form.alarmStatus"
          :items="alarmItems"
          item-text="text"
          item-value="value"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-select
          dense
          outlined
          label="Report Unit"
          v-model="form.reportUnit"
          :items="reportUnits"
          item-text="text"
          item-value="value"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
      </v-form>

      <div class="d-flex justify-center">
        <v-btn
          text outlined
          @click="generate"
          color="success"
          :loading="loading"
          :disabled="loading"
        >
          Generate Report
        </v-btn>
      </div>
    </div>
  </div>

</template>

<script>
import ApiService from '@/service/api';
import BrandService from '@/service/brand';
import CategoryService from '@/service/category';

import SystemData from '@/data/system';

const GROUPS = [
  { text: 'Brand', value: 'BRAND' },
  { text: 'Category', value: 'CATEGORY' },
  { text: 'Position', value: 'POSITION' },
];

const REPORTS_TYPES = [
  { text: 'Prices Report', value: 'Product_Prices', fileName: 'ProductPrices' },
  { text: 'Groups Report', value: 'Product_Groups', fileName: 'ProductGroups' },
];

export default {
  data() {
    return {
      form: {
        selectedReport: null,
        group: GROUPS[0].value,
        positions: [],
        brandId: null,
        categoryId: null,
        alarmStatus: SystemData.ALARM_STATES[0].value,
        reportUnit: 'Pdf',
      },
      selectedReport: REPORTS_TYPES[0],
      reportItems: REPORTS_TYPES,
      groupItems: GROUPS,
      positionItems: SystemData.POSITIONS,
      alarmItems: SystemData.ALARM_STATES,
      reportUnits: SystemData.REPORT_UNITS,
      brands: [],
      categories: [],
      loading: false,
    };
  },
  methods: {
    generate() {
      this.loading = true;
      this.form.selectedReport = this.selectedReport.value;
      ApiService.downloadReport(
        {
          form: this.form,
          url: '/reports/product', 
          fileName: this.selectedReport.fileName,
        }
      ).finally(() => this.loading = false);
    },
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
