<template>
  <v-dialog
    v-model="dialog"
    :max-width="500"
    style="zIndex: 200"
    overlay-opacity="0.2"
    @keydown.esc="close"
  >
    <v-card>
      <v-card-title class="justify-space-between">
        <div class="subtitle-1">Please select a product</div>
        <v-btn icon @click.native="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div class="body-2 mx-3 mb-2 mt-5 font-weight-light">
        <v-icon color="green" class="mx-1" >mdi-shield-alert-outline</v-icon>
        You can either select or create a new product by typing.
      </div>

      <v-combobox
        dense
        outlined
        class="pa-4 mt-2 pb-1"
        label="Product"
        :items="productNames"
        :messages="messages"
        :error="messages != null"
        v-model="selectedName"
        @input.native="selectedName=$event.srcElement.value"
        @keyup.native.enter="agree"
      ></v-combobox>

      <v-divider></v-divider>

      <v-card-actions class="py-3 mr-2 justify-end">
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
  name: 'ProductSelect',
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
  data() {
    return {
      dialog: false,
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
      this.dialog = true;
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
        const id = this.products[this.selectedName.toLowerCase()];
        if (!id || id != this.callerProductId) {
          this.close({ id, name: this.selectedName });
        } else {
          this.messages = 'Same product, please select different one!';
        }
      } else {
        this.messages = 'Please select a product!';
      }
    },
    close(selected) {
      this.callback(selected);
      this.dialog = false;
      this.selectedName = null;
      this.messages = null;
      this.products = {};
      this.productNames = [];
    }
  }
}
</script>
