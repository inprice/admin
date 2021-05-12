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

      <span class="body-1 text-capitalize">{{ ticket.subject.toLowerCase() }}</span>

      <v-spacer></v-spacer>

      <div>
        <v-menu offset-y bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small icon
              class="mx-1"
              v-bind="attrs"
              v-on="on"
              @click.stop=""
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item link @click="$emit('toggled', ticket.id)">
              <v-list-item-title>{{ showDetails ? 'CLOSE' : 'SHOW' }} DETAILS</v-list-item-title>
            </v-list-item>

            <v-list-item link v-if="!ticket.repliedAt" @click="openEditDialog">
              <v-list-item-title>EDIT</v-list-item-title>
            </v-list-item>

            <v-list-item link v-if="ticket.repliedAt && !ticket.csatedAt">
              <v-list-item-title>RATE THE REPLY</v-list-item-title>
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
      class="pa-2"
      style="cursor: pointer"
      @click="$emit('toggled', ticket.id)"
    >
      <v-card
        class="elevation-2 pa-0"
        :class="{ 'col-11' : ticket.repliedAt && showDetails }"
      >
        <div class="d-flex justify-space-between pa-2 body-2">
          <div>
            <v-icon class="mr-2">{{ 'mdi-' + findIcon(ticket.type) }}</v-icon>
            <span class="text-capitalize">{{ ticket.type.toLowerCase() }}</span>
          </div>
        </div>

        <v-divider class="mb-2"></v-divider>

        <p
          class="px-2 pl-4 font-weight-light body-2"
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
              <span class="yellow lighten-3 pa-1 font-weight-medium" v-if="ticket.repliedAt">
                and replied <ago class="d-inline" :date="ticket.repliedAt" />
              </span>
              <span class="yellow lighten-3 pa-1 font-weight-medium" v-else>
                but not replied yet!
              </span>
            </div>

            <div class="my-auto" title="Copy the query" @click.stop="copyTheLink(ticket.query)">
              Copy the content
              <v-icon class="ml-1">mdi-content-copy</v-icon>
            </div>
          </div>
        </div>
      </v-card>

      <v-card
        v-if="showDetails && ticket.repliedAt"
        class="col-11 elevation-2 mt-4 offset-1 pa-0"
      >
        <div class="d-flex justify-space-between pa-2 body-2">
          Reply
        </div>

        <v-divider class="mb-2"></v-divider>

        <p class="px-2 pl-4 font-weight-light body-2" v-html="ticket.reply">
        </p>

        <v-divider></v-divider>

        <div class="d-flex justify-space-between my-auto caption pa-2 ">
          <div>
            Replied <ago class="d-inline" :date="ticket.repliedAt" />
          </div>

          <div title="Copy the reply" @click.stop="copyTheLink(ticket.reply)">
            Copy the content
            <v-icon class="ml-1">mdi-content-copy</v-icon>
          </div>
        </div>
      </v-card>
    </div>

    <edit
      ref="editDialog"
      @saved="updated"
    />

    <confirm ref="confirm"></confirm>

  </v-card>
</template>

<script>
import TicketService from '@/service/ticket';

export default {
  props: ['ticket', 'showDetails'],
  methods: {
    openEditDialog() {
      let cloned = JSON.parse(JSON.stringify(this.ticket));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This ticket').then(async (confirm) => {
        if (confirm == true) {
          const result = await TicketService.remove(this.ticket.id);
          if (result && result.status) this.$emit('removed', this.ticket);
        }
      });
    },
    async updated(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.$emit('updated');
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
    Edit: () => import('./Edit'),
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