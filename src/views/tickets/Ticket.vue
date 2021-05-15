<template>
  <v-card 
    class="mt-3 pa-1"
    :class="(showDetails ? 'elevation-5' : '')"
    :style="(showDetails ? 'margin: 15px 0; border-left: 5px solid red !important' : 'margin: 10px 0')"
  >

    <!-- ------ -->
    <!-- INFO   -->
    <!-- ------ -->
    <v-card-title class="py-1">

      <div class="font-weight-light">
        <v-icon class="mr-2">{{ 'mdi-' + findIcon(ticket.type) }}</v-icon>
        <span class="text-capitalize">{{ ticket.type.toLowerCase() }}</span> about {{ ticket.subject.toLowerCase() }}
      </div>

      <v-spacer></v-spacer>

      <div>
        <v-menu offset-y bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              fab dark
              v-on="on"
              v-bind="attrs"
              @click.stop=""
              style="width:25px; height:25px"
              :color="(ticket.repliedAt ? 'green' : 'orange') + ' lighten-2'"
              :disabled="$store.get('session/isSuperUser')"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item link @click="$emit('toggled', ticket.id)">
              <v-list-item-title>{{ showDetails ? 'CLOSE' : 'SHOW' }} DETAILS</v-list-item-title>
            </v-list-item>

            <v-list-item link v-if="!ticket.repliedAt" @click="$emit('update')">
              <v-list-item-title>EDIT</v-list-item-title>
            </v-list-item>

            <v-list-item link v-if="ticket.repliedAt && !ticket.csatedAt" @click="$emit('rate')">
              <v-list-item-title>RATE THIS</v-list-item-title>
            </v-list-item>

            <v-divider v-if="!ticket.repliedAt"></v-divider>

            <v-list-item link v-if="!ticket.repliedAt" @click="remove">
              <v-list-item-title>DELETE</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>
      </div>

    </v-card-title>

    <!-- ------ -->
    <!-- DETAILS -->
    <!-- ------ -->
    <div
      class="pa-2 pt-0"
      style="cursor: pointer"
      @click="$emit('toggled', ticket.id)"
    >
      <v-card
        class="elevation-2 pa-0"
        :class="{ 'col-11' : ticket.repliedAt && showDetails }"
      >
        <p
          class="pa-3 ma-0 font-weight-light body-2"
          :class="{ 'shorten-text': !showDetails }"
        >
          {{ ticket.query }}
        </p>

        <v-divider></v-divider>

        <div>
          <div class="d-flex justify-space-between my-auto caption pa-2 ">
            <div>
              <span>
                Asked <ago class="d-inline" :date="ticket.createdAt" />
              </span>
              <span class="yellow lighten-5 pa-1 font-weight-medium" v-if="ticket.repliedAt">
                and replied <ago class="d-inline" :date="ticket.repliedAt" />
              </span>
              <span class="yellow lighten-5 pa-1 font-weight-medium" v-else>
                but not replied yet!
              </span>
            </div>

            <div class="my-auto" title="Copy the query" @click.stop="copyTheLink(ticket.query)">
              Copy
              <v-icon class="ml-1">mdi-content-copy</v-icon>
            </div>
          </div>
        </div>
      </v-card>

      <v-card
        v-if="showDetails && ticket.repliedAt"
        class="col-11 elevation-2 mt-4 offset-1 pa-0"
      >
        <div class="d-flex justify-space-between pa-2 body-2" style="background-color: lightcyan">
          <span class="my-auto">Reply</span>
          <v-btn 
            small
            text outlined
            class="my-auto"
            v-if="!ticket.csatedAt"
            @click.stop="$emit('rate')"
            :disabled="$store.get('session/isNotEditor')"
          >
            Rate this
          </v-btn>
        </div>

        <v-divider class="mb-2"></v-divider>

        <p class="pa-3 ma-0 font-weight-light body-2" v-html="ticket.reply">
        </p>

        <v-divider></v-divider>

        <div class="d-flex justify-space-between my-auto caption pa-2 ">
          <div>
            Replied <ago class="d-inline" :date="ticket.repliedAt" />
          </div>

          <div title="Copy the reply" @click.stop="copyTheLink(ticket.reply)">
            Copy
            <v-icon class="ml-1">mdi-content-copy</v-icon>
          </div>
        </div>
      </v-card>

      <v-card
        v-if="showDetails && ticket.csatedAt"
        class="elevation-2 mt-4 pa-0"
      >
        <div class="d-flex justify-space-between pa-2 body-2" style="background-color: aliceblue">
          <span class="my-auto">Your assessment: {{ ticket.csatLevel }}</span>
          <v-btn 
            small
            text outlined
            class="my-auto"
            @click.stop="$emit('rate')"
            :disabled="$store.get('session/isNotEditor')"
          >
            Update
          </v-btn>
        </div>

        <v-divider class="mb-2"></v-divider>

        <div class="pa-3 ma-0 font-weight-light body-2">
          {{ ticket.csatAssessment }}
        </div>

        <v-divider></v-divider>

        <div class="d-flex justify-space-between my-auto caption pa-2 ">
          <div>
            <ago class="d-inline" :date="ticket.csatedAt" />
          </div>
          <div title="Copy the reply" @click.stop="copyTheLink(ticket.csatAssessment)">
            Copy
            <v-icon class="ml-1">mdi-content-copy</v-icon>
          </div>
        </div>
      </v-card>
    </div>

    <confirm ref="confirm"></confirm>

  </v-card>
</template>

<script>
export default {
  props: ['ticket', 'showDetails'],
  methods: {
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This ticket').then((confirm) => {
        if (confirm == true) this.$emit('removed', this.ticket);
      });
    },
    findIcon(type) {
      switch (type) {
        case 'FEEDBACK': return 'feature-search-outline';
        case 'SUPPORT': return 'face-agent';
        case 'INFO': return 'information-outline';
        case 'PROBLEM': return 'comment-question-outline';
      }
    },
    copyTheLink(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'The content copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    }
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
  },
};
</script>

<style scoped>
  .shorten-text {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
</style>