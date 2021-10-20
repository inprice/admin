<template>
  <v-card class="mt-4 pa-1">

    <v-card-title class="justify-space-between py-2">
      <div>
        <div class="caption font-weight-medium">
          <span class="purple--text">{{ ticket.workspace }}</span>
          -
          <span class="teal--text">{{ ticket.fullName }}</span>
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
          title="Copy issue"
          class="my-auto"
          @click="copyIssue(ticket.body)"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-3 pb-5">
      <div class="overline pb-1">Issue</div>
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

      <div class="d-inline-flex justify-end">
        <v-select
          dense solo
          hide-details
          class="col-6"
          label="New Status"
          v-model="status"
          :items="statusItems"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
        <v-btn
          class="my-auto ml-1"
          @click="changeStatus"
        >
          Change
        </v-btn>
      </div>

    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  props: ['ticket'],
  data() {
    return {
      status: null,
      statusItems: ['IN_PROGRESS', 'WAITING_FOR_USER', 'WAITING_FOR_VERSION', 'CLOSED'],
    };
  },
  methods: {
    changeStatus() {
      if (this.ticket.status != this.status) {
        this.$emit('statusChanged', { id: this.ticket.id, status: this.status });
      }
    },
    copyIssue(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'Issue copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
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
  mounted() {
    if (this.ticket.status == 'OPENED') {
      this.status = 'IN_PROGRESS';
    } else {
      this.status = this.ticket.status;
    }
  },
};
</script>
