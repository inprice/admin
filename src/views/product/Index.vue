<template>
  <div>
    <div class="display-1">
      Products
    </div>
    <p class="subtitle">
      In this section, you can manage your products whose prices you want to monitor.
    </p>

    <Search @added="addNew" @searched="search" />
    <List @deleted="deleted" @edited="edited" />
    <Edit @saved="saved" />
  </div>
</template>

<script>
export default {
  methods: {
    addNew() {
      console.info('addNew is clicked!');
    },
    edited(prod) {
      console.info('edit is clicked!', prod);
    },
    saved(form) {
      console.info('save is called!', form);
    },
    deleted(id, name) {
      console.info('delete is clicked!', id, name);
    },
    search(value) {
      console.info('search is made! <'+ value + '>');
    }
  },
  components: {
    Search: () => import('./Search'),
    Edit: () => import('./Edit'),
    List: () => import('./List')
  }
};
</script>
