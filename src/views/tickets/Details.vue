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

      <div v-if="ticket && ticket.commentList.length">

        <div ref="comments" class="scrollable px-4" style="border: 1px solid #ddd">
          <v-card
            v-for="comment in ticket.commentList" :key="comment.id"
            class="col-8 elevation-2 my-5 pa-0"
            :class="{ 'offset-4': !comment.addedByUser }"
          >
            <div
              class="d-flex justify-space-between py-1 px-2"
              style="border: 1px solid #ddd;"
              :style="'background-color: ' + (comment.addedByUser ? '#f9f9f9' : 'aliceblue')"
            >
              <div class="caption my-auto">
                <ago class="caption d-inline" :date="comment.createdAt" /> by <span class="teal--text" >{{ comment.username  }}</span>
              </div>

              <div>
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
                    <v-list-item @click="updateComment(comment)" :disabled="!isEditable(comment)">
                      <v-list-item-title>Update</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeComment(comment.id)" :disabled="!isEditable(comment)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="copyComment(comment.content)">
                      <v-list-item-title>Copy the content</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>

            <v-card-text>
              {{ comment.content }}
            </v-card-text>
          </v-card>
        </div>

      </div>

      <div v-if="ticket.status != 'CLOSED'">

        <div  class="my-3">
          <v-btn
            small
            @click="openCommentPanel(true)"
            v-if="commentPanelOpened==false"
          >
            Add a new Comment
          </v-btn>

          <v-btn
            v-else
            small
            @click="closeCommentPanel"
          >
            Close the Panel
          </v-btn>
        </div>

        <div v-if="commentPanelOpened">
          <v-form ref="form" v-model="valid" @submit.prevent>
            <v-textarea
              ref="commentText"
              solo
              rows="3"
              class="mb-0"
              outlined
              v-model="newComment"
              :rules="rules.newComment"
            ></v-textarea>

            <v-btn
              small
              color="success"
              @click="saveComment"
            >
              {{ updatingCommentId == null ? 'ADD' : 'UPDATE' }}
            </v-btn>
          </v-form>
        </div>

      </div>

      <v-card v-else >
        <block-message dense :message="'Comments are disabled for closed ticket!'" />
      </v-card>

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
      updatingCommentId: null,
      commentPanelOpened: false,
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
        if (confirm) {
          TicketService.removeComment(id).then((res) => {
            if (res && res.status) {
              this.ticket = res.data;
              if (this.commentPanelOpened) this.closeCommentPanel();
            }
          });
        }
      });
    },
    updateComment(comment) {
      this.updatingCommentId = comment.id;
      this.newComment = comment.content;
      this.openCommentPanel(false);
    },
    async saveComment() {
      await this.$refs.form.validate();
      if (this.valid) {
        const form = {
          ticketId: this.ticket.id,
          issue: this.newComment
        };
        if (this.updatingCommentId) {
          form.id = this.updatingCommentId;
        }
        TicketService.saveComment(form).then((res) => {
          if (res && res.status) {
            this.ticket = res.data;
            this.$refs.form.resetValidation();
            this.newComment = null;
            this.valid = false;
            this.$refs.commentText.focus();
            if (this.updatingCommentId) {
              this.closeCommentPanel();
            }
          }
        });
      }
    },
    openCommentPanel(isANewComment) {
      if (isANewComment) this.updatingCommentId = null;
      this.commentPanelOpened = true;
      this.$nextTick(() => this.$refs.commentText.focus());
    },
    closeCommentPanel() {
      this.$refs.form.resetValidation();
      this.commentPanelOpened = false;
      this.updatingCommentId = null;
      this.newComment = null;
      this.valid = false;
    },
    async ticketSaved(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.fetchTicket();
    },
    async ticketRemoved(id) {
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
    copyComment(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'The content copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
    fetchTicket() {
      TicketService.get(this.$route.params.ticketId).then((res) => {
        if (res && res.data) {
          this.ticket = res.data;
        }
      });
    },
    isEditable(comment) {
      if (!comment.editable) return false;
      const user = this.$store.get('session/getCurrentStatus');

      if (user.role == 'SUPER') {
        if (comment.addedByUser) return false;
      }
      if (user.role == 'ADMIN' || this.CURSTAT.user == comment.username) {
        return true;
        } else {
        return false;
      }
    },
  },
  mounted() {
    this.$nextTick(() => this.fetchTicket());
  },
  updated() {
    this.$nextTick(() => {
      const el = this.$refs.comments;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  },
  components: {
    Ticket: () => import('./Ticket.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
};
</script>

<style scoped>
  .scrollable {
    overflow: hidden;
    overflow-y: auto;
    max-height: 30vh;
  }
</style>