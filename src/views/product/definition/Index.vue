<template>
  <div v-if="data.product">

    <div class="d-flex justify-space-between mt-2">
      <v-btn 
        small
        @click="$router.go(-1)">
          <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
          Go Back
      </v-btn>
      <v-btn 
        small
        :disabled="$store.get('session/isViewer')"
        @click="remove">
          <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
          Delete
      </v-btn>
    </div>

    <info :prod="data.product" @edit="edit" @remove="remove" class="mt-3" />
    <prices :prod="data.product" v-if="data.product.avgPrice > 0"  class="mt-3" />

    <links :prodId="data.product.id" :links="data.links" class="mt-3" @deleted="findProduct" @statusToggled="findProduct" />

    <edit ref="editDialog" @saved="findProduct" />
    <confirm ref="confirm" />

  </div>
</template>

<script>
import ProductService from '@/service/product';

export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {
    edit() {
      let cloned = JSON.parse(JSON.stringify(this.data.product));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.product.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(this.data.product.id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Product successfully deleted!' });
            this.$router.push({ name: 'products' });
          }
        }
      });
    },
    openEditDialog() {
      if (this.data.product) {
        this.$refs.editDialog.open(this.data.product);
      }
    },
    findProduct() {
      ProductService.getLinks(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      });
    },
  },
  created() {
    this.$nextTick(() => this.findProduct());
  },
  components: {
    Info: () => import('./Info'),
    Edit: () => import('./Edit'),
    Prices: () => import('./Prices'),
    Links: () => import('./Links'),
    Confirm: () => import('@/component/Confirm.vue')
  },
  watch: {
    '$route.path' () {
      if (window.location.href.indexOf('/product/') > 0) this.findProduct();
    }
  }
};
</script>
