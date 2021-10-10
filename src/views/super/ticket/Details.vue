<template>
  <div>

    <div v-if="ticket">

      <div class="title d-flex justify-space-between mt-3">
        <span class="text-capitalize">Ticket Details - {{ normalizeEnum(ticket.status) }}</span>
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
        @statusChanged="statusChanged"
      />

      <v-card v-if="ticket" class="mt-3 py-2 px-1">

        <v-btn-toggle tile :value="selectedTab">
          <v-btn @click="selectedTab=0" small>
            Comments ({{ ticket.commentList.length }})
          </v-btn>

          <v-btn @click="selectedTab=1" small>
            History ({{ ticket.historyList.length }})
          </v-btn>
        </v-btn-toggle>

        <v-divider></v-divider>

        <v-tabs v-model="selectedTab">
          <v-tab-item>
            <div v-if="ticket.commentList.length">

              <div ref="comments" class="scrollable px-4">
                <v-card
                  v-for="comment in ticket.commentList" :key="comment.id"
                  class="col-8 elevation-2 my-5 pa-0"
                  :class="{ 'offset-4': !comment.addedByUser }"
                >
                  <div
                    class="d-flex justify-space-between py-1 px-2"
                    style="border: 1px solid #ddd;"
                    :style="'background-color: ' + (comment.addedByUser ? '#eeeccc' : '#cceece')"
                  >
                    <div class="caption my-auto">
                      <ago class="caption d-inline" :date="comment.createdAt" /> by <span class="teal--text" >{{ comment.fullName  }}</span>
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
                          <v-list-item @click="updateComment(comment)" :disabled="!isEditable(comment)" v-if="!comment.addedByUser">
                            <v-list-item-title>Update</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="removeComment(comment.id)" :disabled="!isEditable(comment)" v-if="!comment.addedByUser">
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item>

                          <v-divider v-if="!comment.addedByUser"></v-divider>

                          <v-list-item @click="copyComment(comment.body)">
                            <v-list-item-title>Copy the body</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>

                  <v-card-text v-if="comment.addedByUser">
<pre>{{ comment.body }}</pre>
                  </v-card-text>
                  <v-card-text v-else v-html="comment.body"></v-card-text>
                </v-card>
              </div>
            </div>
          </v-tab-item>

          <v-tab-item>
            <div 
              v-if="ticket.historyList.length"
              class="v-data-table v-data-table--dense theme--light put-behind">
              <div class="v-data-table__wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Type</th>
                      <th>Subject</th>
                      <th>Full Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in ticket.historyList" :key="row.id">
                      <td>{{ row.createdAt | formatPlainDate }}</td>
                      <td>{{ row.status }}</td>
                      <td>{{ row.priority }}</td>
                      <td>{{ row.type }}</td>
                      <td>{{ row.subject }}</td>
                      <td>{{ row.fullName }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <block-message 
              v-else dense
              :message="'No history.'"
            />
          </v-tab-item>
        </v-tabs>
      </v-card>

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
            <v-select
              dense
              outlined
              hide-details
              class="col-4 mb-3"
              label="Ticket Status"
              v-model="ticket.status"
              :items="ticketStatusItems"
              v-if="!updatingCommentId"
            ></v-select>

            <v-textarea
              ref="commentText"
              solo
              rows="3"
              class="mb-0"
              outlined
              v-model="body"
              :rules="rules.body"
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

      <v-card v-else class="mt-2">
        <block-message dense :message="'Comments are disabled for closed tickets!'" />
      </v-card>

    </div>

    <v-card v-else >
      <block-message :message="'Invalid ticket!'" />
    </v-card>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SU_TicketService from '@/service/super/ticket';
import { get } from 'vuex-pathify'

export default {
  data()  {
    return {
      ticket: null,
      body: null,
      valid: false,
      updatingCommentId: null,
      commentPanelOpened: false,
      rules: {
        body: [
          v => !!v || "Required",
          v => (v && v.length >= 12) || "Cannot be shorter than 12 chars",
        ],
      },
      selectedTab: 0,
      ticketStatusItems: ['OPENED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'WAITING_FOR_VERSION', 'CLOSED'],
    }
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    updateComment(comment) {
      this.updatingCommentId = comment.id;
      this.body = comment.body;
      this.openCommentPanel(false);
    },
    async saveComment() {
      await this.$refs.form.validate();
      if (this.valid) {
        const form = {
          ticketId: this.ticket.id,
          body: this.body,
          ticketStatus: this.ticket.status
        };
        if (this.updatingCommentId) {
          form.id = this.updatingCommentId;
        }
        SU_TicketService.saveComment(form).then((res) => {
          if (res && res.status) {
            this.ticket.commentList = res.data;
            this.$refs.form.resetValidation();
            this.body = null;
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
    removeComment(id) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This comment').then((confirm) => {
        if (confirm) {
          SU_TicketService.removeComment(id).then((res) => {
            if (res && res.status) {
              this.ticket.commentList = res.data;
              if (this.commentPanelOpened) this.closeCommentPanel();
            }
          });
        }
      });
    },
    closeCommentPanel() {
      this.$refs.form.resetValidation();
      this.commentPanelOpened = false;
      this.updatingCommentId = null;
      this.body = null;
      this.valid = false;
    },
    async statusChanged(form) {
      const result = await SU_TicketService.changeStatus(form);
      if (result && result.status) this.fetchTicket();
    },
    copyComment(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'The body copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
    fetchTicket() {
      SU_TicketService.get(this.$route.params.ticketId).then((res) => {
        if (res && res.data) {
          this.ticket = res.data;
        }
      });
    },
    isEditable(comment) {
      if (!comment.editable || this.ticket.status == 'CLOSED') return false;
      const user = this.$store.get('session/getCurrentStatus');

      if (user.role == 'SUPER') {
        if (comment.addedByUser) return false;
      }
      if (user.role == 'ADMIN' || this.CURSTAT.fullName == comment.fullName) {
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
    max-height: 35vh;
  }
</style>