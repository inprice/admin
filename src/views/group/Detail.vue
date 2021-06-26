<template>
  <div v-if="data.group" class="mt-2">

    <div class="d-flex justify-end">
      <v-btn 
        small
        @click="$router.go(-1)"
      >
        Go Back
      </v-btn>
    </div>

    <group
      :group="data.group"
      :fromSearchPage="false"
      @saved="refreshGroup"
      @linksAdded="refreshWhole($event, 'added')"
      @removed="$router.go(-1)"
    />

    <v-divider class="my-5"></v-divider>

    <div class="d-flex justify-space-between">
      <span class="title">Links</span>
      <div>

        <v-btn
          small
          color="white"
          class="mr-1"
          @click="findGroup(data.group.id)"
          :disabled="$store.get('session/isSuperUser')"
        >
          Refresh
        </v-btn>

        <v-btn
          small
          class="ml-1"
          @click="openAddLinkDialog"
          :disabled="$store.get('session/isNotEditor')"
        >
          Add new Links
        </v-btn>
      </div>
    </div>

    <links
      :groupId="data.group.id"
      :links="data.links"
      @deleted="refreshWhole($event, 'added')"
      @refreshGroup="refreshGroup"
    />

    <confirm ref="confirm" />

    <add-link
      ref="addLinkDialog"
      :groupId="data.group.id"
      :groupName="data.group.name"
      @added="addLinks"
    />

  </div>
</template>

<script>
import GroupService from '@/service/group';

export default {
  data() {
    return {
      data: {},
    };
  },
  methods: {
    findGroup(id) {
      const new_id = id || this.$route.params.id;
      GroupService.getLinks(new_id).then(res => {
        if (res && res.status == true) {
          this.data = res.data;
        }
      });
    },
    refreshGroup(group) {
      this.data.group = group;
    },
    refreshWhole(result, message) {
      this.data.group = result.group;
      this.data.links = result.links;
      if (message) {
        this.$store.commit('snackbar/setMessage', { text: result.count + ' links have been successfully ' + message });
      }
    },
    openAddLinkDialog() {
      this.$refs.addLinkDialog.open();
    },
    async addLinks(links) {
      const result = await GroupService.insertLinks(this.data.group.id, links);
      if (result && result.status) this.refreshWhole(result.data, 'added!');
    },
  },
  mounted() {
    this.findGroup();
  },
  components: {
    Group: () => import('./Group.vue'),
    Links: () => import('./DetailLinks.vue'),
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
