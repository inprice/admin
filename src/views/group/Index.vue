<template>
  <div v-if="data.group">

    <v-card>
      <v-card-title>
        <span>{{ data.group.name }} </span>
        <v-spacer></v-spacer>
        <span class="blue--text" v-if="data.group.price"> {{ data.group.price | toCurrency }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-actions class="py-3">
        <v-btn 
          small
          :disabled="$store.get('session/isViewer')"
          style="min-width: 85px"
          @click="remove">
            Delete
        </v-btn>

        <v-spacer></v-spacer>

        <div>
          <v-btn 
            small
            style="min-width: 85px"
            @click="$router.go(-1)">
              <v-icon>mdi-arrow-left-thin-circle-outline</v-icon> Go Back
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
              Add New Links
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <v-divider></v-divider>

    <prices :group="data.group" v-if="data.group.avgPrice > 0" />

    <div class="title pt-4">Links</div>

    <links :groupId="data.group.id" :links="data.links" @deleted="linksDeleted" />

    <edit ref="editDialog" @saved="findGroup" />

    <add-link ref="addLinkDialog" :groupId="data.group.id" :groupName="data.group.name" @added="linksAdded" />
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
            this.$store.commit('snackbar/setMessage', { text: this.data.group.name + ' successfully deleted!' });
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
    linksDeleted(data) {
      this.$store.commit('snackbar/setMessage', { text: data.count + ' links have been successfully added.' });
      this.$store.commit('session/SET_LINK_COUNT', data.linkCount);
      this.data.links = data.links;
    },
    linksAdded(data) {
      this.$store.commit('snackbar/setMessage', { text: data.count + ' links have been successfully added.' });
      this.$store.commit('session/SET_LINK_COUNT', data.linkCount);
      this.data.links = data.links;
    }
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
