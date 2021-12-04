<template>
  <v-card class="mt-4 pa-1">

    <v-card-title class="justify-space-between py-2">
      <div>
        <div class="caption teal--text font-weight-medium">
          {{ ticket.fullName }}
        </div>
        <div class="body-1">
          <span class="text-capitalize">{{ ticket.type.toLowerCase() }}</span> about {{ ticket.subject.toLowerCase() }}
        </div>
      </div>

      <div class="d-flex">
        <div class="pr-2">
          <v-chip
            small
            label
            dark
            outlined
            class="mx-1 font-weight-medium"
            color="pink"
          >
            {{ ticket.priority }}
          </v-chip>

          <v-chip
            small
            label
            dark
            outlined
            class="mx-1 font-weight-medium"
            color="teal"
          >
            {{ ticket.type }}
          </v-chip>
        </div>

        <v-btn
          small
          icon
          title="Copy description"
          class="my-auto"
          @click="copyIssue(ticket.body)"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-3 pb-5">
      <div class="font-weight-medium teal--text">Description</div>
      {{ ticket.body }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>

      <div class="mr-2 pr-2 caption text-right" >
        <div>
          <span>Created at</span> <ago class="d-inline font-weight-medium" :date="ticket.createdAt" />
        </div>
        <div>
          <span>Progressed at</span> <ago class="d-inline font-weight-medium" :date="ticket.progressedAt" />
        </div>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex justify-end my-auto">
        <v-btn
          small
          class="mr-1"
          :disabled="ticket.status != 'OPENED'"
          @click="remove"
        >
          Delete
        </v-btn>
        <v-btn
          small
          class="mx-2"
          :disabled="ticket.status != 'OPENED'"
          @click="openEditDialog"
        >
          Edit
        </v-btn>
      </div>

    </v-card-actions>

    <confirm ref="confirm"></confirm>
    <edit ref="editDialog" @saved="saved" />

  </v-card>
</template>

<script>
export default {
  props: ['ticket'],
  methods: {
    openEditDialog() {
      const cloned = JSON.parse(JSON.stringify(this.ticket));
      this.$refs.editDialog.open(cloned);
    },
    saved(form) {
      this.$emit('saved', form);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This ticket').then((confirm) => {
        if (confirm == true) {
          this.$emit('removed', this.ticket.id);
        }
      });
    },
    copyIssue(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'Description copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
  },
  components: {
    Edit: () => import('./Edit.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  },
};
</script>
