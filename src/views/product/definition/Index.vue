<template>
  <div v-if="data.product">

    <info :prod="data.product" @edit="edit" @remove="remove" class="mt-4" />
    <prices :prod="data.product" class="mt-2" v-if="data.product.priceDetails.price" />

    <competitors :prodId="data.product.id" :competitors="data.competitors" class="mt-2" />

    <edit ref="editDialog" @saved="findProduct" />
    <confirm ref="confirm" />

  </div>
</template>

<script>
import ProductService from '@/service/product';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {
    addNew() {
      this.$refs.editDialog.open();
    },
    edit() {
      let cloned = JSON.parse(JSON.stringify(this.data.product));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.product.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(this.data.product.id);
          if (result == true) {
            Utility.showInfoMessage('Delete Product', 'Product successfully deleted!');
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
      ProductService.get(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      });
    }
  },
  mounted() {
    this.findProduct();
  },
  components: {
    Info: () => import('./Info'),
    Edit: () => import('./Edit'),
    Prices: () => import('./Prices'),
    Competitors: () => import('./Competitors'),
    confirm: () => import('@/component/Confirm.vue')
  },
  watch: {
    '$route.path' () {
      if (window.location.href.indexOf('/product/') > 0) this.findProduct();
    }
  }
};
</script>
