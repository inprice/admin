<template>
  <v-menu 
    offset-y 
    bottom left
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item :to="{name: 'user-settings'}">
        <v-list-item-avatar class="mr-3">
          <v-avatar color="pink" size="36">
            <span class="white--text font-weight-bold">{{ initials }}</span>
          </v-avatar>
        </v-list-item-avatar>
        <div>
          <v-list-item-title class="subtitle-2">{{ CURSTAT.email }}</v-list-item-title>
          <v-list-item-subtitle>Change your preferences</v-list-item-subtitle>
        </div>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item :to="{name: 'ticket'}">
        <v-list-item-content>
          <v-list-item-title>SUPPORT</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$store.dispatch('session/logout', false)">
        <v-list-item-content>
          <v-list-item-title>LOGOUT</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>

</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    initials() {
      return this.CURSTAT.user.split(' ').map(str => str[0]).join('').toUpperCase();
    }
  },
}
</script>
