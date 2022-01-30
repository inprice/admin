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
      <v-list-item :to="{name: 'user-settings'}" v-if="$store.get('session/isNotSuperUser')">
        <v-list-item-avatar class="mr-3">
          <v-avatar color="pink" size="36">
            <span class="white--text font-weight-bold">{{ initials }}</span>
          </v-avatar>
        </v-list-item-avatar>
        <div>
          <v-list-item-title class="subtitle-2">{{ CURSTAT.fullName ? CURSTAT.fullName : 'UNKNOWN' }}</v-list-item-title>
          <v-list-item-subtitle>Change your preferences</v-list-item-subtitle>
        </div>
      </v-list-item>

      <v-divider v-if="$store.get('session/isNotSuperUser')"></v-divider>

      <v-list-item :to="{name: 'ticket'}" v-if="$store.get('session/isNotSuperUser')">
        <v-icon class="mr-3">mdi-lifebuoy</v-icon>
        <v-list-item-content>
          <v-list-item-title>SUPPORT</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://inprice.io/help-center" v-if="$store.get('session/isNotSuperUser')">
        <v-icon class="mr-3">mdi-help-circle-outline</v-icon>
        <v-list-item-content>
          <v-list-item-title>HELP</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$store.dispatch('session/logout', false)">
        <v-icon class="mr-3">mdi-logout</v-icon>
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
      if (this.CURSTAT.fullName) {
        const words = this.CURSTAT.fullName.replace(/\s+/g, ' ').trim().toUpperCase().split(' ');
        if (words.length == 1) return words[0][0];
        return words[0][0]+words[1][0];
      }
      return '?';
    },
  },
}
</script>
