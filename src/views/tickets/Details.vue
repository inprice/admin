<template>
  <div>

    <div v-if="ticket">

      <div class="title d-flex justify-space-between mt-3">
        <span>Ticket Details</span>
        <div class="d-flex justify-end">
          <v-btn 
            small
            @click="$router.go(-1)"
          >
            Go Back
          </v-btn>
        </div>
      </div>

      <ticket
        :ticket="ticket"
        @saved="ticketSaved"
        @removed="ticketRemoved"
      />

      <div class="title mt-4">
        Comments
      </div>
      <div class="pa-2 pt-0" v-if="ticket && ticket.commentList.length">

        <div>
          <v-timeline>
            <v-timeline-item
              v-for="comment in ticket.commentList" :key="comment.id"
              :color="comment.fromUser ? 'orange' : 'green'"
            >
              <v-card class="elevation-2">
                <v-card-title class="justify-space-between">
                  <div>
                    <div class="subtitle">{{ comment.email  }}</div>
                    <ago :date="comment.createdAt" />
                  </div>

                  <v-menu offset-y bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small icon
                        class="my-auto"
                        v-bind="attrs"
                        v-on="on"
                        @click.stop=""
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item @click="copyTheLink(comment.content)">
                        <v-list-item-title>Copy the content</v-list-item-title>
                      </v-list-item>

                      <v-divider v-if="comment.editable && comment.fromUser"></v-divider>
                      <v-list-item v-if="comment.editable && comment.fromUser">
                        <v-list-item-title>Change</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="removeComment(comment.id)" v-if="comment.editable && comment.fromUser">
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-title>

                <v-card-text>
                  {{ comment.content }}
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>

      </div>
      <v-card v-else >
        <block-message dense :message="'No comment!'" />
      </v-card>

      <div class="title mt-4">
        Add new comment
      </div>

      <v-form ref="form" v-model="valid" @submit.prevent>
        <v-textarea
          rows="3"
          class="mb-0"
          outlined
          v-model="newComment"
          :rules="rules.newComment"
        ></v-textarea>
      </v-form>

      <div class="d-flex justify-end">
        <v-btn
          small
          class="mr-1 col-1"
          @click="cancelComment"
        >
          Cancel
        </v-btn>
        <v-btn
          small
          color="success"
          class="ml-1 col-1"
          @click="addComment"
        >
          Add
        </v-btn>
      </div>

    </div>

    <v-card v-else >
      <block-message :message="'Invalid ticket!'" />
    </v-card>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import TicketService from '@/service/ticket';

export default {
  data()  {
    return {
      ticket: null,
      newComment: null,
      valid: false,
      rules: {
        newComment: [
          v => !!v || "Required",
          v => (v && v.length >= 12 && v.length <= 512) || "Comment must be between 12-512 chars",
        ],
      },
    }
  },
  methods: {
    removeComment(id) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This comment').then((confirm) => {
        console.log('Comment is deleted', id, confirm);
      });
    },
    async addComment() {
      await this.$refs.form.validate();
      if (this.valid) {
        console.log('Comment is added', this.newComment);
      }
    },
    cancelComment() {
      this.$refs.form.resetValidation();
      this.newComment = null;
      this.valid = false;
    },
    async ticketSaved(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.fetchTicket();
    },
    async ticketRemoved(id) {
      console.log('--------------------', id);
      const result = await TicketService.remove(id);
      if (result && result.status) this.$router.go(-1);
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
    },
    fetchTicket() {
      TicketService.get(this.$route.params.ticketId).then((res) => {
        if (res && res.data) {
          this.ticket = res.data;
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => this.fetchTicket());
  },
  components: {
    Ticket: () => import('./Ticket.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>
