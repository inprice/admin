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
              class="py-1"
              v-for="row in announces" :key="row.id"
              style="border-bottom: 1px solid #ddd"
            >

              <v-list-item-content class="py-1">
                <v-list-item-title>{{ row.type + ' (' + row.level +')' }} </v-list-item-title>

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
                  :href="row.link"
                >
                  Open
                </v-btn>

                <v-icon
                  v-else
                  color="grey lighten-1"
                >
                  mdi-star
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>

          <v-list-item v-else>
            <v-list-item-content  class="py-1">
              <v-list-item-subtitle>
                <span style="font-size: 25px; font-weight:bold; vertical-align: middle; line-height: 2;" >🤷🏻‍♂️</span> 
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
            :disabled="!announces || !announces.length"
          >
            See all notifications
          </v-btn>
          <v-btn
            text
            small
            outlined
            class="mr-2"
          >
            Refresh
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
    }
  }
}
</script>

<style scoped>
  .v-sheet.v-card {
    border-radius: 0;
  }
</style>