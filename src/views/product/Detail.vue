<template>
  <div class="mt-2">

    <div class="d-flex justify-space-between my-3">
      <v-btn small @click="$router.go(-1)">Back</v-btn>
      <span class="title font-weight-light">Product Details</span>

      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small icon
            v-on="on"
            v-bind="attrs"
            elevation="1"
          >
            <v-icon>mdi-dots-vertical-circle-outline</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item link @click="findProduct">
            <v-list-item-title>REFRESH</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="openEditProductDialog" :disabled="$store.get('session/isNotEditor')">
            <v-list-item-title>EDIT</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link @click="deleteProduct" :disabled="$store.get('session/isNotEditor')">
            <v-list-item-title>DELETE</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <block-message 
      v-if="loading" dense
      :loading="loading"
      message="Loading, please wait..."
    />

    <v-divider class="my-2" ></v-divider>

    <div v-if="data && data.product">

      <div class="d-flex justify-space-between title">
        <div class="my-auto">
          <div class="caption font-weight-medium teal--text">{{ data.product.sku }}</div>
          <div>{{ data.product.name }}</div>
        </div>
        <div class="text-right my-auto">
          <div 
            class="caption font-weight-medium" 
            :style="'color: ' + findPositionColor(data.product.position)"
          >
            {{ data.product.position }}
          </div>
          <div>{{ data.product.price | toPrice }}</div>
        </div>
      </div>

      <v-card class="mt-2">
        <table class="property-table" v-show="$vuetify.breakpoint.smAndUp">
          <tr>
            <th>Base Price</th>
            <td>
              {{ data.product.basePrice | toPrice }}
            </td>
            <th>Suggested</th>
            <td>
              <span v-if="data.product.smartPriceId && !data.product.suggestedPriceProblem">{{ data.product.suggestedPrice | toPrice }}</span>
              <span v-else-if="data.product.suggestedPriceProblem">{{ data.product.suggestedPriceProblem }}</span>
              <span v-else-if="!data.product.smartPriceId">Not bound!</span>
            </td>
          </tr>

          <tr>
            <th>Brand</th>
            <td>{{ data.product.brandName }}</td>
            <th>Min Price</th>
            <td>
              <span>{{ data.product.minPrice | toPrice }}</span>
              <span class="caption mx-1" v-if="data.product.minSeller && data.product.minSeller != 'NA'">by {{ data.product.minSeller }}</span>
              <span class="caption" v-if="data.product.minSeller != data.product.minPlatform && data.product.minSeller != 'You'">on {{ data.product.minPlatform }}</span>
            </td>
          </tr>

          <tr>
            <th>Category</th>
            <td>{{ data.product.categoryName }}</td>
            <th>Avg Price</th>
            <td>
              {{ data.product.avgPrice | toPrice }}
            </td>
          </tr>

          <tr>
            <th>Alarm</th>
            <td>
              <alarm-note
                :alarm="data.product.alarm"
                @clicked="openAlarmDialogForProduct"
              ></alarm-note>
            </td>
            <th>Max Price</th>
            <td>
              <span>{{ data.product.maxPrice | toPrice }}</span>
              <span class="caption mx-1" v-if="data.product.maxSeller && data.product.maxSeller != 'NA'">by {{ data.product.maxSeller }}</span>
              <span class="caption" v-if="data.product.maxSeller != data.product.maxPlatform && data.product.maxSeller != 'You'">on {{ data.product.maxPlatform }}</span>
            </td>
          </tr>
        </table>

        <table class="property-table" v-show="$vuetify.breakpoint.xs">
          <tr><th>Position</th><td>{{ data.product.position }}</td></tr>
          <tr><th>Sku</th><td>{{ data.product.sku }}</td></tr>
          <tr><th>Brand</th><td>{{ data.product.brandName }}</td></tr>
          <tr><th>Category</th><td>{{ data.product.categoryName }}</td></tr>
          <tr>
            <th>Alarm</th>
            <td>
              <alarm-note
                :alarm="data.product.alarm"
                @clicked="openAlarmDialogForProduct"
              ></alarm-note>
            </td>
          </tr>

          <tr><th>Base Price</th><td>{{ data.product.basePrice | toPrice }}</td></tr>

          <tr>
            <th>Suggested</th>
            <td>
              <span v-if="data.product.smartPriceId && !data.product.suggestedPriceProblem">{{ data.product.suggestedPrice | toPrice }}</span>
              <span v-else-if="data.product.suggestedPriceProblem">{{ data.product.suggestedPriceProblem }}</span>
              <span v-else-if="!data.product.smartPriceId">Not bound!</span>
            </td>
          </tr>

          <tr>
            <th>Min Price</th>
            <td>
              <span>{{ data.product.minPrice | toPrice }}</span>
              <span class="caption mx-1" v-if="data.product.minSeller && data.product.minSeller != 'NA'">by {{ data.product.minSeller }}</span>
              <span class="caption" v-if="data.product.minSeller != data.product.minPlatform && data.product.minSeller != 'You'">on {{ data.product.minPlatform }}</span>
            </td>
          </tr>

          <tr><th>Avg Price</th><td>{{ data.product.avgPrice | toPrice }}</td></tr>

          <tr>
            <th>Max Price</th>
            <td>
              <span>{{ data.product.maxPrice | toPrice }}</span>
              <span class="caption mx-1" v-if="data.product.maxSeller && data.product.maxSeller != 'NA'">by {{ data.product.maxSeller }}</span>
              <span class="caption" v-if="data.product.maxSeller != data.product.maxPlatform && data.product.maxSeller != 'You'">on {{ data.product.maxPlatform }}</span>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <div v-if="data && data.product" class="d-flex justify-space-between mt-6 mb-3">
      <span class="title mr-2">Links</span>

      <div>
        <v-btn 
          small
          class="mx-1"
          color="error"
          @click="deleteMultiple"
          :disabled="selected < 1 || $store.get('session/isNotEditor')"
        >
          Delete ({{ selected }})
        </v-btn>

        <v-btn 
          small
          class="mx-1"
          @click="moveMultiple"
          :disabled="selected < 1 || $store.get('session/isNotEditor')"
        >
          Move
        </v-btn>

        <v-btn 
          small
          class="mx-1"
          @click="openAddLinkDialog"
          :disabled="$store.get('session/isNotEditor')"
        >
          Add Links
        </v-btn>
      </div>
    </div>

    <v-expansion-panels v-if="data && data.product" multiple v-model="openedPanels">
      <link-panel 
        v-for="(value, key) in this.grouppedLinks" :key="key"
        :name="key" 
        :links="value"
        @checked="refreshSelected" 
        @deleteOne="deleteOneLink"
        @moveOne="moveOneLink"
        @openAlarmDialog="openAlarmDialogForLink"
      ></link-panel>
    </v-expansion-panels>

    <block-message 
      v-if="data && (!data.links || data.links.length == 0)" dense
      message="No link found."
    ></block-message>

    <confirm ref="confirm" />

    <add-link
      v-if="data && data.product"
      ref="addLinkDialog"
      :productId="data.product.id"
      :productName="data.product.name"
      @added="addLinks"
    />

    <alarm-dialog
      :key="alarmRefresher"
      ref="alarmDialog"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    ></alarm-dialog>

    <product-edit-dialog ref="productEditDialog" @saved="save"></product-edit-dialog>
    <product-select-dialog ref="productSelectDialog"></product-select-dialog>

  </div>
</template>

<script>
import ProductService from '@/service/product';
import LinkService from '@/service/link';
import AlarmService from '@/service/alarm';

export default {
  data() {
    return {
      data: {},
      grouppedLinks: {},
      openedPanels: [0],
      selected: 0,
      loading: false,
      alarmRefresher: 0
    };
  },
  methods: {
    openEditProductDialog() {
      let cloned = JSON.parse(JSON.stringify(this.data.product));
      this.$refs.productEditDialog.open(cloned);
    },
    deleteProduct() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.product.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(this.data.product.id);
          if (result && result.status) this.$router.go(-1);
        }
      });
    },
    async save(form) {
      const result = await ProductService.save(form);
      if (result && result.status) {
        this.data.product = result.data.product;
        this.$refs.productEditDialog.close();
        this.refreshPanels();
      }
    },
    findProduct(hideLoading) {
      if (!hideLoading) this.loading = true;
      ProductService.getLinks(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
          this.refreshPanels();
        }
      }).finally(() => {
        if (!hideLoading) this.loading = false;
      });
    },
    refreshPanels() {
      this.selected = 0;
      this.grouppedLinks = {};
      if (this.data && this.data.links) {
        this.data.links.forEach(row => {
          if (!this.grouppedLinks[row.grup]) this.grouppedLinks[row.grup] = [];
          row.selected = false;
          this.grouppedLinks[row.grup].push(row);
          this.openedPanels = [1];
          this.openedPanels = [0];
        });
      }
    },
    openAddLinkDialog() {
      this.$refs.addLinkDialog.open();
    },
    async addLinks(links) {
      const result = await ProductService.insertLinks(this.data.product.id, links);
      if (result && result.status) {
        this.data = result.data;
        this.refreshPanels();
      }
    },
    refreshSelected() {
      let count = 0;
      if (this.data && this.data.links) {
        this.data.links.forEach(row => {
          if (row.selected) count += 1;
        });
      }
      this.selected = count;
    },
    async deleteOneLink(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ row.id ], this.data.product.id);
          if (result && result.data) {
            this.data = result.data;
            this.refreshPanels();
          }
        }
      });
    },
    deleteMultiple() {
      if (this.selected) {
        const selection = [];
        if (this.data && this.data.links) {
          this.data.links.forEach(row => {
            if (row.selected) {
              selection.push(row.id);
            }
          });
        }
        const title = `${selection.length} links`;
        this.$refs.confirm.open('Delete', ' will be deleted. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await LinkService.remove(selection, this.data.product.id);
            if (result && result.data) {
              this.data = result.data;
              this.refreshPanels();
            }
          }
        });
      }
    },
    async moveOneLink(row) {
      this.$refs.productSelectDialog.open('For the selected link, please select a product to move', this.data.product.id).then(async (data) => {
        if (data && (data.id || data.name)) {
          const result = await LinkService.moveTo({
            fromProductId: this.data.product.id,
            toProductId: data.id,
            toProductName: data.name,
            linkIdSet: [ row.id ],
          });
          if (result && result.data) {
            this.data = result.data;
            this.refreshPanels();
          }
        }
      });
    },
    moveMultiple() {
      if (this.selected) {
        const selection = [];
        if (this.data && this.data.links) {
          this.data.links.forEach(row => {
            if (row.selected) {
              selection.push(row.id);
            }
          });
        }
        const title = `${selection.length} links`;
        this.$refs.productSelectDialog.open(`For selected ${title}, please select a product to move`, this.data.product.id).then(async (data) => {
          if (data && (data.id || data.name)) {
            const result = await LinkService.moveTo({
              fromProductId: this.data.product.id,
              toProductId: data.id,
              toProductName: data.name,
              linkIdSet: selection,
            });
            if (result && result.data) {
              this.data = result.data;
              this.refreshPanels();
            }
          }
        });
      }
    },
    openAlarmDialogForProduct() {
      let cloned = {};
      if (this.data.product.alarm) {
        cloned = JSON.parse(JSON.stringify(this.data.product.alarm));
      } else {
        cloned = {
          subject: 'POSITION',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'PRODUCT';
      cloned.productId = this.data.product.id;
      cloned.name = this.data.product.name;
      this.$refs.alarmDialog.open(cloned);
    },
    openAlarmDialogForLink(link) {
      let cloned = {};
      if (link.alarm) {
        cloned = JSON.parse(JSON.stringify(link.alarm));
      } else {
        cloned = {
          subject: 'POSITION',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'LINK';
      cloned.linkId = link.id;
      cloned.name = link.name || link.url;
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      const result = await AlarmService.save(form);
      if (result && result.status) {
        this.data.product.alarm = result.data;
        this.alarmRefresher++;
      }
    },
    setAlarmOff(form) {
      AlarmService.remove(form.id).then((res) => {
        if (res && res.status) {
          this.data.product.alarm = null;
          this.alarmRefresher++;
        }
      });
    },
  },
  mounted() {
    this.findProduct();
  },
  components: {
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    AddLink: () => import('./AddLink'),
    LinkPanel: () => import('./LinkPanel'),
    ProductEditDialog: () => import('./Edit'),
    ProductSelectDialog: () => import('@/views/product/Select.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
  watch: {
    '$route.params.id': {
        handler: function() {
          this.findProduct();
        },
      }
  },
};
</script>
