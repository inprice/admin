<template>
  <div v-if="data.product">

    <info :prod="data.product" @edit="edit" class="mt-4" />
    <prices :prod="data.product" :priceLabels="data.priceLabels" :priceData="data.priceData" class="mt-2" />

    <competitors :prodId="data.product.id" :rows="data.competitors" />

    <edit ref="editDialog" />
    <confirm ref="confirm" />

  </div>
</template>

<script>
import ProductService from '@/service/product';

export default {
  data() {
    return {
      rows: [],
      data: {}
    };
  },
  methods: {
    addNew() {
      this.$refs.editDialog.open();
    },
    edit(rowNo) {
      let cloned = JSON.parse(JSON.stringify(this.rows[rowNo]));
      this.$refs.editDialog.open(cloned);
    },
    async save(form) {
      const result = await ProductService.save(form);
      if (result == true) {
        this.$refs.editDialog.close();
        this.search();
      } else {
        this.$refs.editDialog.stopLoading();
      }
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.product.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(this.data.product.id);
          if (result == true) {
            this.search();
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
