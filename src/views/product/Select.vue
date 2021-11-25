<template>
  <v-dialog
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
    style="z-index: 100"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>Please select target product</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3" v-if="products && products.length">
        <v-select
          dense
          outlined
          label="Product"
          :items="products"
          item-value="left"
          item-text="right"
          v-model="selectedProduct"
          return-object
          hide-details
          @keyup.native.enter="agree"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
      </v-card-text>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="agree"
          :disabled="$store.get('session/isNotEditor')"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ProductService from '@/service/product';

export default {
  name: 'product-select',
  data() {
    return {
      show: false,
      resolve: null,
      callback: null,
      products: [],
      selectedProduct: [],
      callerProductId: null,
    };
  },
  methods: {
    open(callerProductId) {
      this.show = true;
      this.callerProductId = callerProductId;

      ProductService.getIdNameList(callerProductId).then((res) => {
        if (res && res.data) {
          this.products = res.data;
          this.selectedProduct = res.data[0];
        }
      });
      return new Promise((callback) => this.callback = callback);
    },
    agree() {
      if (this.selectedProduct) {
        if (this.selectedProduct && this.selectedProduct.left && this.selectedProduct.left != this.callerProductId) {
          this.close({ id: this.selectedProduct.left, name: this.selectedProduct.right });
        }
      }
    },
    close(selected) {
      this.callback(selected);
      this.show = false;
      this.selectedProduct = null;
      this.products = [];
    }
  }
}
</script>
