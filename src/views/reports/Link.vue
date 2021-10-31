<template>
  <div class="d-flex justify-center mt-5">
    <div style="max-width: 400px">
      <div class="text-h5 mb-6 text-center">Link Reports</div>

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
          small-chips
          multiple
          outlined
          label="Statuses"
          v-model="form.grups"
          :items="grupItems"
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

        <v-text-field
          dense
          outlined
          label="Sku"
          v-model="form.sku"
          type="text"
          maxlength="50"
        />

        <v-text-field
          dense
          outlined
          label="Brand"
          v-model="form.brand"
          type="text"
          maxlength="50"
        />

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
import SystemData from '@/data/system';

const REPORTS_TYPES = [
  { text: 'Status Report', value: 'Link_Status', fileName: 'LinkStatus' },
];

export default {
  data() {
    return {
      form: {
        selectedReport: null,
        sku: null,
        brand: null,
        seller: null,
        platform: null,
        grups: [],
        positions: [],
        alarmStatus: SystemData.ALARM_STATES[0].value,
        reportUnit: 'Pdf',
      },
      selectedReport: REPORTS_TYPES[0],
      reportItems: REPORTS_TYPES,
      grupItems: SystemData.LINK_STATUSES,
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
          url: '/reports/link', 
          fileName: this.selectedReport.fileName,
        }
      ).finally(() => this.loading = false);
    },
  },
 }
</script>
