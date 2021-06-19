<template>
  <div>
    <v-menu
      v-model="menu"
      offset-y
      :close-on-content-click="false"
      nudge-width="400"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-badge
            dot
            overlap
            bordered
            color="red"
            offset-x="10"
            offset-y="10"
            :value="hasAnnounce()"
          >
            <v-icon>mdi-bell{{ !hasAnnounce() ? '-outline' : '' }}</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card elevation="0">
        <v-list two-line>
          <v-list-item-group v-if="hasAnnounce()">
            <v-list-item
              :ripple="false"
              class="py-1 pt-0 pr-0"
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
                <v-list-item-action-text><ago class="d-inline font-weight-bold" :date="row.createdAt" /></v-list-item-action-text>
                <v-btn
                  small
                  text
                  outlined
                  color="white"
                  v-if="row.link"
                  :target="row.link.startsWith('http') ? '_blank' : ''"
                  :href="row.link"
                >
                  Open
                </v-btn>
                <v-list-item-action-text v-else>{{ row.type }}</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>

          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-icon>mdi-emoticon-sad-outline</v-icon>
                No new notification found!
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <div class="pa-1 pb-2 d-flex justify-space-between">
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
          >
            See all notifications
          </v-btn>
        </div>
      </v-card>
    </v-menu>
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
    }
  }
}
</script>

<style scoped>
  .v-sheet.v-card {
    border-radius: 0;
  }
</style>