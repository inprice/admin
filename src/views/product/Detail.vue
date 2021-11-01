<template>
  <div class="mt-2">

    <div class="d-flex justify-space-between my-3">
      <v-btn small @click="$router.go(-1)">Back</v-btn>

      <div>
        <v-btn 
          small
          class="mr-1"
          color="error"
          @click="deleteProduct"
          :disabled="$store.get('session/isNotEditor')"
        >
          DELETE
        </v-btn>

        <v-btn 
          small
          class="ml-1"
          @click="openEditProductDialog"
          :disabled="$store.get('session/isNotEditor')"
        >
          EDIT
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <block-message 
      v-if="loading" dense
      :loading="loading"
      message="Loading, please wait..."
    />

    <div v-if="data && data.product">

      <div class="d-flex justify-space-between py-3 title">
        <div class="my-auto">
          {{ data.product.name }}
        </div>
        <div class="text-right">
          <div class="caption teal--text font-weight-medium">{{ data.product.position }}</div>
          <div class="my-auto">{{ data.product.price | toPrice }}</div>
        </div>
      </div>

      <v-card tile>

        <div class="d-flex">
          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">SKU</div>
                <div>{{ data.product.sku || '-' }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Brand</div>
                <div>{{ data.product.brandName || '-' }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Category</div>
                <div>{{ data.product.categoryName || '-' }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Alarm</div>
                <alarm-note
                  :alarm="data.product.alarm"
                  @clicked="openAlarmDialogForProduct"
                ></alarm-note>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list dense class="col pa-1">
            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Suggested Price</div>
                <div v-if="data.product.smartPriceId && !data.product.suggestedPriceProblem">{{ data.product.suggestedPrice | toPrice }}</div>
                <div v-else-if="data.product.suggestedPriceProblem">{{ data.product.suggestedPriceProblem }}</div>
                <div v-else-if="!data.product.smartPriceId">Not bound!</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Minimum Price</div>
                <div>
                  <span>{{ data.product.minPrice | toPrice }}</span>
                  <span class="caption mx-1" v-if="data.product.minSeller && data.product.minSeller != 'NA'">by {{ data.product.minSeller }}</span>
                  <span class="caption" v-if="data.product.minSeller != data.product.minPlatform && data.product.minSeller != 'You'">on {{ data.product.minPlatform }}</span>
                </div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Average Price</div>
                <div>{{ data.product.avgPrice | toPrice }}</div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <div class="caption blue--text">Maximum Price</div>
                <div>
                  <span>{{ data.product.maxPrice | toPrice }}</span>
                  <span class="caption mx-1" v-if="data.product.maxSeller && data.product.maxSeller != 'NA'">by {{ data.product.maxSeller }}</span>
                  <span class="caption" v-if="data.product.maxSeller != data.product.maxPlatform && data.product.maxSeller != 'You'">on {{ data.product.maxPlatform }}</span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
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
          class="mr-1"
          @click="moveMultiple"
          :disabled="selected < 1 || $store.get('session/isNotEditor')"
        >
          Move
        </v-btn>

        <v-btn 
          small
          class="ml-1"
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
