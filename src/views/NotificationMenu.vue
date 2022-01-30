<template>
  <div>
    <v-menu
      offset-y
      v-model="menu"
      :close-on-content-click="false"
      nudge-width="400"
    >
      <template v-slot:activator="{ on }">
        <v-btn 
          small fab 
          v-on="on" 
          :elevation="hasAnnounce() ? 1 : 0"
          :color="hasAnnounce() ? 'white' : 'transparent'"
        >
          <v-icon :style="hasAnnounce() ? 'color: red' : ''">
            mdi-bell{{ hasAnnounce() ? '-ring' : '-outline' }}
          </v-icon>
        </v-btn>
      </template>

      <v-card elevation="0">
        <v-list two-line>
          <v-list-item-group v-if="hasAnnounce()">
            <v-list-item
              :ripple="false"
              @click.stop="showDetails(row)"
              class="pb-1 pt-0 pr-0"
              v-for="row in announces" :key="row.id"
              style="border-bottom: 1px solid #ddd"
            >
              <v-list-item-content class="py-1">
                <v-list-item-title>
                  <v-chip
                    small
                    dark
                    class="mb-2 pa-3 font-weight-medium"
                    :color="row.level == 'INFO' ? 'cyan' : 'pink'"
                  >
                    {{ row.level }}
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle
                  class="text--primary"
                  v-text="row.title"
                ></v-list-item-subtitle>

              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  small text outlined
                  color="primary"
                  v-if="row.link"
                  @click.stop="openLink(row.link)"
                >
                  Open
                </v-btn>
                <v-list-item-action-text v-if="!row.link">{{ row.type }}</v-list-item-action-text>
                <v-list-item-action-text><ago class="d-inline font-weight-bold" :date="row.createdAt" /></v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>

          <div class="px-4 pt-3" v-else>
            No new notification found!
          </div>
        </v-list>

        <v-divider class="mt-1" v-if="!hasAnnounce()"></v-divider>

        <div class="pa-2 d-flex justify-space-between">
          <v-btn
            text
            small
            class="text-none"
            @click="markAllAsRead"
            :disabled="!announces || !announces.length"
          >
            Mark all as Read
          </v-btn>
          <v-btn
            text
            small
            class="text-none"
            @click="gotoPage"
            :disabled="$router.history.current.name == 'announce'"
          >
            See all notifications
          </v-btn>
        </div>
      </v-card>
    </v-menu>

    <info-dialog ref="info"></info-dialog>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    announces: get('message/getAnnounces'),
  },
  data() {
    return {
      menu: false,
    }
  },
  methods: {
    hasAnnounce() {
      return (this.announces && this.announces.length);
    },
    markAllAsRead() {
      this.$store.dispatch('message/markAllAnnouncesAsRead');
    },
    gotoPage() {
      this.menu = false;
      this.$router.push({ name: 'announce' });
    },
    showDetails(announce) {
      this.$store.dispatch('message/markAnAnnounceAsRead', announce.id);
      this.$refs.info.open(announce.title, null, announce.body);
    },
    openLink(url) {
      this.menu = false;
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        this.$router.push({ path: `/${this.$route.params.sid}/app${url}` });
      }
    }
  },
  components: {
    InfoDialog: () => import('@/component/InfoDialog.vue'),
  },
}
</script>

<style scoped>
  .v-sheet.v-card {
    border-radius: 0;
  }
</style>