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

      <v-card-text class="py-0 mt-3">
        <v-combobox
          dense
          outlined
          label="Product"
          :items="productNames"
          :messages="messages"
          :error="messages != null"
          v-model="selectedName"
          @input.native="selectedName=$event.srcElement.value"
          @keyup.native.enter="agree"
        ></v-combobox>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-space-between pa-3">
        <div class="caption">
          <v-icon color="green" class="mx-1" >mdi-shield-alert-outline</v-icon>
          You can either select or create a new product by typing.
        </div>
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
      title: null,
      callback: null,
      products: [],
      productNames: [],
      selectedName: null,
      callerProductId: null,
      messages: null,
    };
  },
  methods: {
    open(title, callerProductId) {
      this.show = true;
      this.title = title;
      this.callerProductId = callerProductId;

      ProductService.getIdNameList().then((res) => {
        if (res && res.data) {
          const names = [];
          res.data.forEach(product => {
            this.products[product.right.toLowerCase()] = product.left; //in order to finding id by name!
            if (product.left != callerProductId) {
              names.push(product.right);
            }
          });
          this.productNames = names;
        }
      });
      return new Promise((callback) => this.callback = callback);
    },
    agree() {
      if (this.selectedName) {
        if (this.selectedName.length > 2 && this.selectedName.length < 251) {
          const id = this.products[this.selectedName.toLowerCase()];
          if (!id || id != this.callerProductId) {
            this.close({ id, name: this.selectedName });
          } else {
            this.messages = 'Same product, please select different one!';
          }
        } else {
          this.messages = 'Name must be between 3-250 chars!';
        }
      } else {
        this.messages = 'Please select a product!';
      }
    },
    close(selected) {
      this.callback(selected);
      this.show = false;
      this.selectedName = null;
      this.messages = null;
      this.products = {};
      this.productNames = [];
    }
  }
}
</script>
