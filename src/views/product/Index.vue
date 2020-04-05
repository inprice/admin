<template>
  <div>
    <div class="display-1">
      Products
    </div>

    <p class="subtitle">
      In this section, you can manage your products whose prices you want to monitor.
    </p>

    <Search
      @add="addNew"
      @search="search"
    />
    
    <List
      :rows="rows"
      @edit="edit"
      @toggle="toggle"
      @remove="remove"
    />
    
    <Edit
      ref="editDialog"
      @save="save"
    />

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import ProductService from '@/service/product-service';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      rows: [],
      searchForm: {
        term: '',
        lastRowNo: 0,
        orderBy: 'name'
      }
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
    remove(data) {
      this.$refs.confirm.open('Delete', data.name, 'will be deleted. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(data.id);
          if (result == true) {
            this.search();
          }
        }
      });
    },
    async search(term) {
      if (term !== undefined) this.searchForm.term = term;

      const result = await ProductService.search(this.searchForm);
      if (result) {
        this.rows = result;
      } else {
        this.rows = [];
      }
    },
    toggle(id) {
      ProductService.toggle(id);
    }
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.search('');
    });
  },
  components: {
    Search: () => import('./Search'),
    Edit: () => import('./Edit'),
    List: () => import('./List'),
    confirm: () => import('@/component/Confirm.vue')
  }
};
</script>
