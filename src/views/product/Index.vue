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
      ref="list"
      :rows="rows"
      @edit="edit"
      @toggle="toggle"
      @remove="remove"
      @loadmore="search(undefined, true)"
    />
    
    <Edit
      ref="editDialog"
      @save="save"
    />

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import ProductService from '@/service/product';
import Utility from '@/helpers/utility';
import SystemConsts from '@/data/system';

export default {
  data() {
    return {
      rows: [],
      searchForm: {
        term: '',
        lastRowNo: 0
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
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', data.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await ProductService.remove(data.id);
          if (result == true) {
            this.search();
          }
        }
      });
    },
    async search(term, loadmore=false) {
      if (term !== undefined) this.searchForm.term = term;

      if (loadmore == true) {
        this.searchForm.lastRowNo = this.rows.length;
      } else {
        this.searchForm.lastRowNo = 0;
      }

      let isLoadMoreEnabled = false;
      const result = await ProductService.search(this.searchForm);

      if (result) {
        if (loadmore == true) {
          this.rows = this.rows.concat(result);
        } else {
          this.rows = result;
        }
        isLoadMoreEnabled = (result.length == SystemConsts.system.ROW_LIMIT_FOR_LISTS);
      } else {
        this.rows = [];
      }

      this.$refs.list.setLoadMoreActivation(isLoadMoreEnabled);
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
