<template>
  <v-card class="mt-4 pa-1">

    <v-card-title class="justify-space-between py-2">
      <div>
        <div class="caption teal--text font-weight-medium">
          {{ ticket.email }}
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
            :color="findStatusColor()"
          >
            {{ ticket.status }}
          </v-chip>

          <v-chip
            small
            label
            dark
            outlined
            class="mx-1 font-weight-medium"
            :color="findPriorityColor()"
          >
            {{ ticket.priority }}
          </v-chip>

          <v-chip
            small
            label
            dark
            outlined
            class="mx-1 font-weight-medium"
            :color="findTypeColor()"
          >
            {{ ticket.type }}
          </v-chip>
        </div>

        <v-btn
          small
          icon
          title="Copy content"
          class="my-auto"
          @click="copyTheContent(ticket.issue)"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-3 pb-5">
      <div class="overline pb-1">Issue</div>
      {{ ticket.issue }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>

      <div class="mr-2 caption text-right pr-2" >
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
    copyTheContent(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'Comment copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
    findStatusColor() {
      switch (this.ticket.status) {
        case 'OPENED': return 'blue';
        case 'IN_PROGRESS': return 'green';
        case 'WAITING_FOR_USER': return 'orange';
        case 'WAITING_FOR_VERSION': return 'cyan';
        case 'CLOSED': return 'red';
      }
      return 'gray';
    },
    findPriorityColor() {
      switch (this.ticket.priority) {
        case 'LOW': return 'green';
        case 'NORMAL': return 'blue';
        case 'HIGH': return 'pink';
        case 'CRITICAL': return 'red';
      }
      return 'gray';
    },
    findTypeColor() {
      switch (this.ticket.type) {
        case 'FEEDBACK': return 'blue';
        case 'SUPPORT': return 'green';
        case 'PROBLEM': return 'pink';
      }
      return 'gray';
    },
  },
  components: {
    Edit: () => import('./Edit.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  },
};
</script>
