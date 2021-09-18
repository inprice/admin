<template>
  <v-card class="my-5 pa-1 pb-3" tile>

    <!-- ------ -->
    <!-- INFO   -->
    <!-- ------ -->
    <v-card-title class="py-1 justify-space-between">
      <div @click="openDetails" :style="fromSearchPage ? 'cursor: pointer;' : ''">
        <div style="font-weight: normal">{{ product.name }}</div>
        <div class="caption">{{ product.description }}</div>
      </div>

      <div>
        <span v-if="product.price"> {{ product.price | toCurrency }}</span>

        <div class="d-inline">
          <v-menu offset-y bottom left :disabled="$store.get('session/isNotEditor')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small icon
                class="mx-1"
                v-bind="attrs"
                v-on="on"
                @click.stop=""
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item link v-if="fromSearchPage"  @click="openDetails">
                <v-list-item-title>DETAILS</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="openEditDialog">
                <v-list-item-title>EDIT</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item link @click="remove">
                <v-list-item-title>DELETE</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item link @click="openAlarmDialog">
                <v-list-item-title>SET ALARM</v-list-item-title>
              </v-list-item>

            </v-list>
          </v-menu>
        </div>
      </div>

    </v-card-title>

    <!-- ------ -->
    <!-- PRICES -->
    <!-- ------ -->
    <div class="d-flex flex-wrap justify-start px-1" @click="openDetails" :style="fromSearchPage ? 'cursor: pointer;' : ''">

      <v-card
        v-if="product.minPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Minimum Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ product.minPrice | toPrice }}
          </span>
          <span v-else>
            {{ product.minPrice | toCurrency }}
          </span>
        </div>
        <div class="caption">
          <span class="font-weight-medium">{{ product.minSeller }}</span> | {{ product.minPlatform }}
        </div>
      </v-card>

      <v-card
        v-if="product.avgPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Average Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ product.avgPrice | toPrice }}
          </span>
          <span v-else>
            {{ product.avgPrice | toCurrency }}
          </span>
        </div>
        <div>
          <span class="font-weight-medium">{{ product.actives }}</span> <span class="caption">active links</span>
        </div>
      </v-card>

      <v-card
        v-if="product.maxPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Maximum Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ product.maxPrice | toPrice }}
          </span>
          <span v-else>
            {{ product.maxPrice | toCurrency }}
          </span>
        </div>
        <div class="caption">
          <span class="font-weight-medium">{{ product.maxSeller }}</span> | {{ product.maxPlatform }}
        </div>
      </v-card>

      <v-card
        v-if="!product.price && product.total"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Total
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ product.total | toPrice }}
          </span>
          <span v-else>
            {{ product.total | toCurrency }}
          </span>
        </div>
        <div>
          <span class="font-weight-medium">{{ product.linkCount }}</span> <span class="caption">total links</span>
        </div>
      </v-card>

      <v-card
        v-if="product.price"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Your Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ product.price | toPrice }}
          </span>
          <span v-else>
            {{ product.price | toCurrency }}
          </span>
        </div>

        <span :class="findLevelColor(product.level) +'--text caption font-weight-medium'">
          {{ product.level }}
        </span>
      </v-card>

      <v-card
        v-if="!product.minPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
        style="text-align: center"
      >
        <div class="caption text-uppercase font-weight-light">
          Links
        </div>
        <div class="d-flex">
          <div class="mr-2">
            <span v-if="product.actives" class="font-weight-medium">{{ product.actives }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">active links,</span>
          </div>
          <div>
            <span v-if="product.waitings" class="font-weight-medium">{{ product.waitings }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">waiting links</span>
          </div>
        </div>
        <div class="d-flex">
          <div class="mr-2">
            <span v-if="product.tryings" class="font-weight-medium">{{ product.tryings }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">trying links,</span>
          </div>
          <div>
            <span v-if="product.problems" class="font-weight-medium">{{ product.problems }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">problem links</span>
          </div>
        </div>
      </v-card>

    </div>

    <alarm-note
      v-if="product.alarm"
      :alarm="product.alarm"
      class="pl-2 pt-3"
      @clicked="openAlarmDialog"
      :key="alarmNoteRefresherKey"
    ></alarm-note>

    <alarm-dialog
      ref="alarmDialog"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    ></alarm-dialog>

    <edit ref="editDialog" @saved="save"></edit>
    <confirm ref="confirm"></confirm>

  </v-card>
</template>

<script>
import ProductService from '@/service/product';
import AlarmService from '@/service/alarm';

export default {
  props: ['fromSearchPage', 'product'],
  computed: {
    findMinWidthForCells() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '48%'
        default:
          return '24.25%'
      }
    }
  },
  data() {
    return {
      alarmNoteRefresherKey: 0,
    };
  },
  methods: {
    openEditDialog() {
      let cloned = JSON.parse(JSON.stringify(this.product));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.product.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(this.product.id);
          if (result && result.status) this.$emit('removed', this.product);
        }
      });
    },
    async save(form) {
      const result = await ProductService.save(form);
      if (result && result.status) {
        this.$emit('saved', result.data.product);
      }
    },
    openDetails() {
      if (this.fromSearchPage) {
        this.$router.push({ name: 'product', params: {id: this.product.id} });
      }
    },
    openAlarmDialog() {
      let cloned = {};
      if (this.product.alarm) {
        cloned = JSON.parse(JSON.stringify(this.product.alarm));
      } else {
        cloned = {
          subject: 'STATUS',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'PRODUCT';
      cloned.name = this.product.name;
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      form.productId = this.product.id;
      const result = await AlarmService.save(form);
      if (result && result.status) {
        this.product.alarm = result.data;
        this.product.alarmId = result.data.id;
        this.alarmNoteRefresherKey++;
      }
    },
    setAlarmOff(form) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          const self = this;
          AlarmService.remove(form.id).then((res) => {
            if (res && res.status) {
              self.product.alarmId = null;
              self.product.alarm = null;
              self.alarmNoteRefresherKey++;
            }
          });
        }
      });
    },
  },
  components: {
    Edit: () => import('./Edit'),
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  },
};
</script>

<style scoped>
  .text-h6 {
    font-weight: normal;
  }
</style>