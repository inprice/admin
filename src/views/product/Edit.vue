<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          <div>{{ form.id ? 'Edit' : 'New' }} Product</div>
          <div v-if="form.id" class="caption">For {{ form.name }}</div>
        </div>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <input type="hidden" :value="form.id">

          <v-text-field
            dense
            outlined
            label="Sku"
            v-model="form.sku"
            :rules="rules.sku"
            type="text"
            maxlength="50"
          />

          <v-text-field
            dense
            outlined
            label="Name"
            v-model="form.name"
            :rules="rules.name"
            type="text"
            maxlength="250"
          />

          <v-text-field
            dense
            outlined
            label="Price"
            v-model="form.price"
            :rules="rules.price"
            @blur="formatPrice"
            type="number"
            maxlength="10"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            label="Base Price"
            v-model="form.basePrice"
            :rules="rules.basePrice"
            @blur="formatPrice"
            type="number"
            maxlength="10"
          ></v-text-field>

          <v-select
            dense
            outlined
            clearable
            label="Smart Price"
            v-model="form.smartPriceId"
            :items="smartPriceItems"
            item-text="name"
            item-value="id"
            :menu-props="{ bottom: true, offsetY: true }"
            :return-object="false"
          ></v-select>

          <v-combobox
            dense
            outlined
            clearable
            label="Brand"
            v-model="form.brand"
            :rules="rules.brand"
            :items="brandItems"
            item-text="name"
            item-value="id"
            :search-input.sync="newBrandName"
            hide-no-data
          >
            <template v-slot:selection="{ item }">
              <span v-if="item === Object(item)">{{ item.name }}</span>
            </template>
            <template v-slot:item="{ item }">
              {{ item.name }}
            </template>
          </v-combobox>

          <v-combobox
            dense
            outlined
            clearable
            label="Category"
            v-model="form.category"
            :rules="rules.category"
            :items="categoryItems"
            item-text="name"
            :search-input.sync="newCategoryName"
            hide-no-data
          >
            <template v-slot:selection="{ item }">
              <span v-if="item === Object(item)">{{ item.name }}</span>
            </template>
            <template v-slot:item="{ item }">
              {{ item.name }}
            </template>
          </v-combobox>

        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          @click="save"
          color="success"
          :disabled="$store.get('session/isNotEditor')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SmartPriceService from '@/service/smartprice';
import CategoryService from '@/service/category';
import BrandService from '@/service/brand';

export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        sku: '',
        name: '',
        price: 0,
        basePrice: 0,
        smartPriceId: null,
        brand: null,
        category: null,
      },
      newCategoryName: null,
      newBrandName: null,
      brandItems: [],
      categoryItems: [],
      smartPriceItems: [],
    };
  },
  methods: {
    open(data) {
      this.show = true;

      if (data) {
        this.form.id = data.id;
        this.form.sku = data.sku;
        this.form.name = data.name;
        this.form.price = data.price;
        this.form.basePrice = data.basePrice;
      } else {
        delete this.form.id;
        this.form.sku = '';
        this.form.name = '';
        this.form.price = 0;
        this.form.basePrice = 0;
      }

      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
        self.formatPrice();

        SmartPriceService.getList().then(res => {
          if (res && res.data) {
            this.smartPriceItems = res.data;
          } else {
            this.smartPriceItems = [];
          }
        }).finally(() => {
          if (data && data.smartPriceId && this.smartPriceItems.length) {
            this.form.smartPriceId = data.smartPriceId;
          }
        });
        BrandService.getList().then(res => {
          if (res && res.data) {
            this.brandItems = res.data;
          } else {
            this.brandItems = [];
          }
        }).finally(() => {
          if (data && data.brandId && this.brandItems.length) {
            this.form.brand = { id: data.brandId, name: data.brandName };
          } else {
            this.form.brand = null;
          }
        });
        CategoryService.getList().then(res => {
          if (res && res.data) {
            this.categoryItems = res.data;
          } else {
            this.categoryItems = [];
          }
        }).finally(() => {
          if (data && data.categoryId && this.categoryItems.length) {
            this.form.category = { id: data.categoryId, name: data.categoryName };
          } else {
            this.form.category = null;
          }
        });
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.form.price = parseFloat(this.form.price);
        this.form.basePrice = parseFloat(this.form.basePrice);
        this.$emit('saved', this.form);
      }
    },
    close() {
      this.show = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        sku: [
          v => (!v || (v.length >= 2 && v.length <= 50)) || "If given, must be between 2-50 chars"
        ],
        name: [
          v => !!v || "Required",
          v => (v && v.length >= 3 && v.length <= 250) || "Name must be between 3-250 chars"
        ],
        description: [
          v => (!v || (v.length <= 128)) || "Can be up to 128 chars"
        ],
        price: [
          v => (!v || parseFloat(v) > -1) || "Price must be equal or greater than 0"
        ],
        basePrice: [
          v => (!v || parseFloat(v) > -1) || "Base Price must be equal or greater than 0"
        ],
        brand: [
          v => (!v || (v.name && v.name.length >= 2 && v.name.length <= 50)) || "If given, must be between 2-50 chars"
        ],
        category: [
          v => (!v || (v.name && v.name.length >= 2 && v.name.length <= 50)) || "If given, must be between 2-50 chars"
        ],
      }
    },
    formatPrice() {
      this.form.price = parseFloat(('0' + this.form.price).replace(/[^\d.]/g, '')).toFixed(2);
      this.form.basePrice = parseFloat(('0' + this.form.basePrice).replace(/[^\d.]/g, '')).toFixed(2);
    }
  },
  watch: {
    'form.category' (val) {
      if (!val || val.id) return;
      if (val && !val.id && val.name) return;

      if (this.categoryItems.length) {
        const lastCategory = this.categoryItems[this.categoryItems.length-1];
        if (lastCategory.id === undefined) {
          lastCategory.name = val;
          this.form.category = lastCategory;
          return;
        }
      }
      const neu = { id: undefined, name: val };
      this.categoryItems.push(neu);
      this.form.category = neu;
    },
    'form.brand' (val) {
      if (!val || val.id) return;
      if (val && !val.id && val.name) return;

      if (this.brandItems.length) {
        const lastBrand = this.brandItems[this.brandItems.length-1];
        if (lastBrand.id === undefined) {
          lastBrand.name = val;
          this.form.brand = lastBrand;
          return;
        }
      }
      const neu = { id: undefined, name: val };
      this.brandItems.push(neu);
      this.form.brand = neu;
    },
  },
};
</script>
