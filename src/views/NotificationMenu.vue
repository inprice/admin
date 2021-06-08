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
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </template>

      <v-card elevation="0">
        <v-list two-line>
          <v-list-item-group v-if="announces && announces.length">
            <template v-for="(row, index) in announces">
              <v-list-item :key="row.id">

                <v-list-item-content class="py-1">
                  <v-list-item-title>{{ row.type + ' (' + row.level +')' }} </v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.title"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle class="text-truncate" v-text="item.body"></v-list-item-subtitle>
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

              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>

          <v-list-item v-else>
            <v-list-item-content  class="py-1">
              <v-list-item-subtitle>
                <span style="font-size: 25px; font-weight:bold; vertical-align: middle; line-height: 2;" >🤷🏻‍♂️</span> 
                No new notification found!
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
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
export default {
  data() {
    return {
      menu: false,
      announces: null
    }
  },
}
</script>

<style scoped>
  .v-sheet.v-card {
    border-radius: 0;
  }
</style>