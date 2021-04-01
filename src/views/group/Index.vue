<template>
  <div v-if="data.group">

    <div class="d-flex mt-2">
      <v-btn 
        small
        @click="$router.go(-1)">
          <v-icon class="mr-2">mdi-arrow-left-circle-outline</v-icon>
          Go Back
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn 
        small
        class="mr-2"
        :disabled="$store.get('session/isViewer') || !data.defauld"
        @click="remove">
          Delete
      </v-btn>

      <v-btn 
        small 
        :disabled="$store.get('session/isViewer')"
        color="success"
        @click="edit">
          Edit
      </v-btn>
    </div>

    <info :group="data.group" @edit="edit" @remove="remove" class="mt-2" />
    <prices :group="data.group" v-if="data.group.avgPrice > 0" />

    <links :groupId="data.group.id" :links="data.links" class="mt-2" @deleted="findGroup" @statusToggled="findGroup" />

    <edit ref="editDialog" @saved="findGroup" />
    <confirm ref="confirm" />

  </div>
</template>

<script>
import GroupService from '@/service/group';

export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {
    edit() {
      let cloned = JSON.parse(JSON.stringify(this.data.group));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.data.group.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await GroupService.remove(this.data.group.id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Group successfully deleted!' });
            this.$router.push({ name: 'groups' });
          }
        }
      });
    },
    openEditDialog() {
      if (this.data.group) {
        this.$refs.editDialog.open(this.data.group);
      }
    },
    findGroup() {
      GroupService.getLinks(this.$route.params.id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      });
    },
  },
  created() {
    this.$nextTick(() => this.findGroup());
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
      if (window.location.href.indexOf('/group/') > 0) this.findGroup();
    }
  }
};
</script>
