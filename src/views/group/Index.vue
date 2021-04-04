<template>
  <div v-if="data.group">

    <div class="d-flex justify-space-between my-2">
      <div class="title">
        {{ data.group.name }} <span> - {{ data.group.price | toCurrency }}</span>
      </div>

      <div>
        <v-btn 
          small
          :disabled="$store.get('session/isViewer')"
          style="min-width: 85px"
          @click="remove">
            Delete
        </v-btn>

        <v-btn 
          small
          :disabled="$store.get('session/isViewer')"
          class="mx-3"
          style="min-width: 85px"
          color="success"
          @click="edit">
            Edit
        </v-btn>

        <v-btn 
          small
          :disabled="$store.get('session/isViewer')"
          style="min-width: 85px"
          color="info"
          @click="openAddLinkDialog()">
            Add new
        </v-btn>

      </div>
    </div>

    <prices :group="data.group" v-if="data.group.avgPrice > 0" />

    <links class="mt-2" :groupId="data.group.id" :links="data.links" @deleted="findGroup" @statusToggled="findGroup" />

    <edit ref="editDialog" @saved="findGroup" />

    <add-link ref="addLinkDialog" :groupId="data.group.id" :groupName="data.group.name" />
    <confirm ref="confirm" />

  </div>
</template>

<script>
import GroupService from '@/service/group';

export default {
  data() {
    return {
      data: { },
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
          const data = await GroupService.remove(this.data.group.id);
          if (data) {
            this.$store.commit('snackbar/setMessage', { text: 'Group successfully deleted!' });
            this.$store.commit('session/SET_LINK_COUNT', data.linkCount);
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
    openAddLinkDialog() {
      this.$refs.addLinkDialog.open();
    },
  },
  created() {
    this.$nextTick(() => this.findGroup());
  },
  components: {
    Edit: () => import('./Edit'),
    Prices: () => import('./Prices'),
    Links: () => import('./Links'),
    AddLink: () => import('./AddLink'),
    Confirm: () => import('@/component/Confirm.vue')
  },
  watch: {
    '$route.path' () {
      if (window.location.href.indexOf('/group/') > 0) this.findGroup();
    }
  }
};
</script>
